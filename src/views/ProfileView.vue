<template>
    <div class="profile-page">
        <AppHeader />

        <section class="profile-hero">
            <div class="hero-card">
                <div class="avatar">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
                    <span v-else>{{ initials }}</span>
                </div>
                <div class="hero-text">
                    <h2>{{ $t('profile.title') }}</h2>
                    <p>{{ $t('profile.subtitle') }}</p>
                </div>
                <div class="hero-actions">
                    <button v-if="!editing" class="btn primary" @click="startEdit">
                        {{ $t('profile.edit') }}
                    </button>
                    <button v-else class="btn ghost" @click="cancelEdit">
                        {{ $t('profile.cancel') }}
                    </button>
                    <label class="btn outline upload-btn">
                        {{ uploading ? $t('profile.uploading') : $t('profile.changePhoto') }}
                        <input type="file" accept="image/*" @change="handleAvatarChange" />
                    </label>
                </div>
            </div>
        </section>

        <section class="profile-body">
            <div class="profile-card">
                <div class="card-header">
                    <div>
                        <h3>{{ $t('profile.accountInfo') }}</h3>
                        <p class="meta" v-if="createdAt">{{ $t('profile.memberSince') }} {{ createdAt }}</p>
                    </div>
                    <span class="role-pill">{{ user?.role || 'customer' }}</span>
                </div>

                <form class="profile-form" @submit.prevent="saveProfile">
                    <div class="grid">
                        <label class="field">
                            <span>{{ $t('profile.name') }}</span>
                            <input v-model="form.name" type="text" :disabled="!editing" />
                        </label>
                        <label class="field">
                            <span>{{ $t('profile.email') }}</span>
                            <input v-model="form.email" type="email" :disabled="!editing" />
                        </label>
                        <label class="field">
                            <span>{{ $t('profile.phone') }}</span>
                            <input v-model="form.phone" type="text" :disabled="!editing" />
                        </label>
                        <label class="field full">
                            <span>{{ $t('profile.address') }}</span>
                            <input v-model="form.address" type="text" :disabled="!editing" />
                        </label>
                    </div>

                    <p v-if="error" class="error-text">{{ error }}</p>
                    <p v-if="success" class="success-text">{{ success }}</p>

                    <div class="actions">
                        <button v-if="editing" type="submit" class="btn primary" :disabled="saving">
                            {{ saving ? $t('profile.saving') : $t('profile.save') }}
                        </button>
                        <button type="button" class="btn outline" @click="handleLogout">
                            {{ $t('profile.logout') }}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import store from '../store/index.js';
import { authApi, API_BASE } from '../services/api.js';

const router = useRouter();
const user = computed(() => store.state.user);
const token = computed(() => store.state.authToken);

const editing = ref(false);
const saving = ref(false);
const uploading = ref(false);
const error = ref('');
const success = ref('');
const form = ref({
    name: '',
    email: '',
    phone: '',
    address: ''
});

const initials = computed(() => {
    const name = user.value?.name || 'User';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
});

const createdAt = computed(() => {
    if (!user.value?.created_at) return '';
    try {
        return new Date(user.value.created_at).toLocaleDateString();
    } catch (error) {
        return '';
    }
});

const avatarUrl = computed(() => {
    const avatar = user.value?.avatar;
    if (!avatar) return '';
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    if (avatar.startsWith('/uploads')) {
        const base = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : '';
        return `${base}${avatar}`;
    }
    return avatar;
});

const syncForm = () => {
    if (!user.value) return;
    form.value = {
        name: user.value.name || '',
        email: user.value.email || '',
        phone: user.value.phone || '',
        address: user.value.address || ''
    };
};

const startEdit = () => {
    syncForm();
    error.value = '';
    success.value = '';
    editing.value = true;
};

const cancelEdit = () => {
    editing.value = false;
    error.value = '';
    success.value = '';
    syncForm();
};

const saveProfile = async () => {
    if (!editing.value) return;
    const nextName = form.value.name?.trim() || user.value?.name || '';
    if (!nextName) {
        error.value = 'Name is required.';
        return;
    }
    if (!token.value) {
        error.value = 'Missing auth token. Please login again.';
        return;
    }

    try {
        saving.value = true;
        error.value = '';
        success.value = '';
        const payload = {
            name: nextName,
            email: form.value.email?.trim() || null,
            phone: form.value.phone?.trim() || null,
            address: form.value.address?.trim() || null
        };
        await authApi.updateProfile(payload, token.value);
        const refreshed = await authApi.me(token.value);
        store.methods.updateUser(refreshed.user);
        syncForm();

        const isSaved =
            (refreshed.user.name || '') === (payload.name || '') &&
            (refreshed.user.email || '') === (payload.email || '') &&
            (refreshed.user.phone || '') === (payload.phone || '') &&
            (refreshed.user.address || '') === (payload.address || '');

        if (!isSaved) {
            error.value = 'Saved response does not match your changes. Please check your database connection.';
            return;
        }

        success.value = 'Profile updated successfully.';
        editing.value = false;
    } catch (err) {
        error.value = err.message || 'Failed to update profile.';
    } finally {
        saving.value = false;
    }
};

const handleAvatarChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!token.value) {
        error.value = 'Missing auth token. Please login again.';
        return;
    }
    if (!file.type.startsWith('image/')) {
        error.value = 'Please select an image file.';
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        error.value = 'Image is too large (max 2MB).';
        return;
    }

    try {
        uploading.value = true;
        error.value = '';
        success.value = '';
        const data = await authApi.uploadAvatar(file, token.value);
        store.methods.updateUser(data.user);
        success.value = 'Profile photo updated.';
    } catch (err) {
        const msg = err.message || 'Failed to upload photo.';
        if (msg.includes('Cannot POST /api/auth/avatar') || msg.includes('Cannot POST /auth/avatar')) {
            error.value = 'Avatar upload route not found. Restart the API server after running npm install in /server.';
        } else {
            error.value = msg;
        }
    } finally {
        uploading.value = false;
        event.target.value = '';
    }
};

const handleLogout = () => {
    store.methods.logout();
    router.push({ name: 'login' });
};

watch(user, () => {
    if (!editing.value) syncForm();
});

onMounted(async () => {
    if (token.value) {
        try {
            const data = await authApi.me(token.value);
            store.methods.updateUser(data.user);
        } catch (err) {
            error.value = 'Unable to load profile. Please login again.';
        }
    } else {
        syncForm();
    }
});
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
        radial-gradient(circle at top left, #fff1d6, transparent 45%),
        radial-gradient(circle at bottom right, #e9f0ff, transparent 45%),
        #f4f6f8;
}

.profile-hero {
    padding: 40px 15px 10px;
}

.hero-card {
    max-width: 980px;
    margin: 0 auto;
    background: linear-gradient(120deg, #1f2937, #374151);
    color: white;
    border-radius: 16px;
    padding: 26px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 20px;
    box-shadow: 0 20px 35px rgba(31, 41, 55, 0.25);
}

.avatar {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    background: linear-gradient(135deg, #f6c463, #e6b34e);
    display: grid;
    place-items: center;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
    box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.2);
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-text h2 {
    margin: 0 0 6px;
    font-size: 26px;
}

.hero-text p {
    margin: 0;
    color: #d1d5db;
    font-size: 14px;
}

.hero-actions {
    display: flex;
    gap: 10px;
}

.profile-body {
    flex: 1;
    padding: 20px 15px 60px;
}

.profile-card {
    max-width: 980px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 26px;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
}

.card-header h3 {
    margin: 0 0 4px;
    font-size: 18px;
}

.meta {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
}

.role-pill {
    background: #111827;
    color: white;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 6px 12px;
    border-radius: 999px;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: #4b5563;
}

.field input {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fff;
}

.field input:focus {
    outline: none;
    border-color: #e6b34e;
    box-shadow: 0 0 0 3px rgba(230, 179, 78, 0.2);
}

.field input:disabled {
    background: #f9fafb;
    color: #6b7280;
}

.field.full {
    grid-column: span 2;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    border-radius: 10px;
    padding: 10px 18px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: 0.2s;
}

.btn.primary {
    background: #e6b34e;
    color: white;
}

.btn.primary:hover {
    background: #d6a23e;
}

.btn.ghost {
    background: rgba(255, 255, 255, 0.14);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn.outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
}

.upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.upload-btn input {
    display: none;
}

.btn.outline:hover {
    border-color: #9ca3af;
}

.error-text {
    color: #dc2626;
    font-size: 13px;
}

.success-text {
    color: #16a34a;
    font-size: 13px;
}

@media (max-width: 768px) {
    .hero-card {
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
    }

    .hero-actions {
        width: 100%;
        justify-content: center;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .field.full {
        grid-column: span 1;
    }
}
</style>
