<template>
    <div class="auth-page">
        <AppHeader />

        <div class="auth-container">
            <div class="flip-card" :class="{ 'flipped': !isLogin }">
                <div class="flip-card-inner">

                    <div class="flip-card-front">
                        <form class="form-box" @submit.prevent="submitLogin">
                            <h2>{{ $t('header.login') }}</h2>

                            <div v-if="!loginWithEmail" class="input-group phone-group">
                                <div class="flag-select">
                                    <img src="https://flagcdn.com/w20/kh.png" alt="Cambodia" />
                                    <span>+855</span>
                                    <i class="fa-solid fa-caret-down"></i>
                                </div>
                                <input v-model="loginForm.phone" class="khmer-text" type="text" placeholder="91 234 567" />
                            </div>

                            <div v-else class="input-group">
                                <input v-model="loginForm.email" class="khmer-text" type="email" placeholder="Your Email Address" />
                            </div>

                            <div class="sub-text text-right" @click="loginWithEmail = !loginWithEmail">
                                {{ loginWithEmail ? 'Use Phone Instead' : 'Use Email Instead' }}
                            </div>
                            <div class="input-group">
                                <input v-model="loginForm.password" class="khmer-text" type="password" placeholder="Password" />
                            </div>

                            <div class="form-options">
                                <label class="checkbox-container">
                                    <input type="checkbox" /> Remember Me
                                </label>
                                <a href="#" class="forgot-link">Forgot Password?</a>
                            </div>

                            <p v-if="loginError" class="error-text">{{ loginError }}</p>
                            <button class="submit-btn" type="submit" :disabled="loginLoading">
                                {{ loginLoading ? 'Logging in...' : $t('header.login') }}
                            </button>

                            <div class="divider">
                                <span>Or Login With</span>
                            </div>

                            <div class="social-login">
                                <button class="social-btn fb"><i class="fa-brands fa-facebook-f"></i></button>
                                <button class="social-btn gg"><i class="fa-brands fa-google"></i></button>
                                <button class="social-btn tw"><i class="fa-brands fa-twitter"></i></button>
                            </div>

                            <div class="bottom-action">
                                Don't have an account? <a href="#" @click.prevent="switchToRegister">Register Now</a>
                            </div>
                        </form>
                    </div>

                    <div class="flip-card-back">
                        <form class="form-box" @submit.prevent="submitRegister">
                            <h2>{{ $t('header.register') }}</h2>

                            <div class="input-group">
                                <input v-model="registerForm.name" class="khmer-text" type="text" placeholder="Full Name" />
                            </div>

                            <div v-if="!registerWithEmail" class="input-group phone-group">
                                <div class="flag-select">
                                    <img src="https://flagcdn.com/w20/kh.png" alt="Cambodia" />
                                    <span>+855</span>
                                    <i class="fa-solid fa-caret-down"></i>
                                </div>
                                <input v-model="registerForm.phone" class="khmer-text" type="text" placeholder="91 234 567" />
                            </div>

                            <div v-else class="input-group">
                                <input v-model="registerForm.email" class="khmer-text" type="email" placeholder="Your Email Address" />
                            </div>

                            <div class="sub-text text-right" @click="registerWithEmail = !registerWithEmail">
                                {{ registerWithEmail ? 'Use Phone Instead' : 'Use Email Instead' }}
                            </div>
                            <div class="input-group">
                                <input v-model="registerForm.password" class="khmer-text" type="password" placeholder="Password" />
                            </div>

                            <div class="input-group">
                                <input v-model="registerForm.confirmPassword" class="khmer-text" type="password" placeholder="Confirm Password" />
                            </div>

                            <div class="terms-text">
                                <label class="checkbox-container top-align">
                                    <input type="checkbox" />
                                    <span>By clicking 'Sign Up' you agree to the Terms & Conditions.</span>
                                </label>
                            </div>

                            <p v-if="registerError" class="error-text">{{ registerError }}</p>
                            <button class="submit-btn" type="submit" :disabled="registerLoading">
                                {{ registerLoading ? 'Creating account...' : $t('header.register') }}
                            </button>

                            <div class="divider">
                                <span>Or Join With</span>
                            </div>

                            <div class="social-login">
                                <button class="social-btn fb"><i class="fa-brands fa-facebook-f"></i></button>
                                <button class="social-btn gg"><i class="fa-brands fa-google"></i></button>
                                <button class="social-btn tw"><i class="fa-brands fa-twitter"></i></button>
                            </div>

                            <div class="bottom-action">
                                Already have an account? <a href="#" @click.prevent="switchToLogin">Log In</a>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import store from '../store/index.js';
import { authApi } from '../services/api.js';

const route = useRoute();
const router = useRouter();

// State Variables
const isLogin = ref(true); // true = Show Login, false = Show Register
const loginWithEmail = ref(false);
const registerWithEmail = ref(false);
const loginForm = ref({ email: '', phone: '', password: '' });
const registerForm = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
const loginError = ref('');
const registerError = ref('');
const loginLoading = ref(false);
const registerLoading = ref(false);

// Logic: Check URL to decide which side to show
const checkRoute = () => {
    // If the URL is /register OR has ?mode=register, show the back side
    if (route.name === 'register' || route.query.mode === 'register') {
        isLogin.value = false;
    } else {
        isLogin.value = true;
    }
};

onMounted(() => {
    checkRoute();
});

// Watch for URL changes (e.g., clicking header links)
watch(() => route.name, () => {
    checkRoute();
});

// Switch Functions
const switchToRegister = () => {
    isLogin.value = false;
    // Optional: Update URL without reloading
    router.push({ name: 'register' });
};

const switchToLogin = () => {
    isLogin.value = true;
    router.push({ name: 'login' });
};

const submitLogin = async () => {
    loginError.value = '';
    if (loginLoading.value) return;

    const payload = loginWithEmail.value
        ? { email: loginForm.value.email?.trim(), password: loginForm.value.password }
        : { phone: loginForm.value.phone?.trim(), password: loginForm.value.password };

    if (!payload.password || (!payload.email && !payload.phone)) {
        loginError.value = 'Please enter your email or phone and password.';
        return;
    }

    try {
        loginLoading.value = true;
        const data = await authApi.login(payload);
        store.methods.login(data.user, data.token);
        router.push({ name: 'profile' });
    } catch (error) {
        loginError.value = error.message === 'Failed to fetch'
            ? 'Cannot reach API server. Please start the backend on http://localhost:4000.'
            : (error.message || 'Login failed.');
    } finally {
        loginLoading.value = false;
    }
};

const submitRegister = async () => {
    registerError.value = '';
    if (registerLoading.value) return;

    const payload = {
        name: registerForm.value.name?.trim(),
        password: registerForm.value.password,
        email: registerWithEmail.value ? registerForm.value.email?.trim() : null,
        phone: registerWithEmail.value ? null : registerForm.value.phone?.trim()
    };

    if (!payload.name) {
        registerError.value = 'Please enter your full name.';
        return;
    }
    if (!payload.password) {
        registerError.value = 'Please enter a password.';
        return;
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        registerError.value = 'Passwords do not match.';
        return;
    }
    if (!payload.email && !payload.phone) {
        registerError.value = 'Please enter your email or phone number.';
        return;
    }

    try {
        registerLoading.value = true;
        const data = await authApi.register(payload);
        store.methods.login(data.user, data.token);
        router.push({ name: 'profile' });
    } catch (error) {
        registerError.value = error.message === 'Failed to fetch'
            ? 'Cannot reach API server. Please start the backend on http://localhost:4000.'
            : (error.message || 'Registration failed.');
    } finally {
        registerLoading.value = false;
    }
};
</script>

<style scoped>
.auth-page {
    background-color: #f4f6f8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.auth-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    perspective: 1000px;
    /* Essential for 3D flip */
}

/* --- FLIP ANIMATION --- */
.flip-card {
    background-color: transparent;
    width: 450px;
    height: 700px;
    /* Adjusted height to fit content */
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-style: preserve-3d;
}

/* When flipped class is present, rotate it */
.flip-card.flipped .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 40px;
    box-sizing: border-box;
}

/* The back side is already rotated 180deg */
.flip-card-back {
    transform: rotateY(180deg);
}

/* --- FORM STYLES --- */
h2 {
    color: #333;
    margin-bottom: 25px;
    font-size: 22px;
}

.input-group {
    margin-bottom: 15px;
    position: relative;
}

.input-group input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
}

.input-group input:focus {
    border-color: #e6b34e;
}

.phone-group {
    display: flex;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.phone-group input {
    border: none;
}

.flag-select {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f9f9f9;
    padding: 0 10px;
    border-right: 1px solid #ddd;
    font-size: 13px;
    color: #555;
    cursor: pointer;
}

.sub-text {
    font-size: 12px;
    color: #888;
    margin-top: -10px;
    margin-bottom: 15px;
    cursor: pointer;
    user-select: none;
}

.text-right {
    text-align: right;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-bottom: 20px;
    color: #666;
}

.forgot-link {
    color: #666;
    text-decoration: none;
}

.terms-text {
    font-size: 12px;
    color: #777;
    margin-bottom: 20px;
    text-align: left;
    line-height: 1.5;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.top-align {
    align-items: flex-start;
}

.submit-btn {
    width: 100%;
    background-color: #e6b34e;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.submit-btn:hover {
    background-color: #d6a23e;
}

.divider {
    margin: 25px 0;
    position: relative;
    text-align: center;
}

.divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #eee;
}

.divider span {
    background: white;
    padding: 0 10px;
    position: relative;
    color: #888;
    font-size: 12px;
}

.social-login {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
}

.social-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.social-btn:hover {
    transform: scale(1.1);
}

.fb {
    background-color: #3b5998;
}

.gg {
    background-color: #db4437;
}

.tw {
    background-color: #1da1f2;
}

.bottom-action {
    font-size: 14px;
    color: #666;
}

.bottom-action a {
    color: #e6b34e;
    font-weight: bold;
    text-decoration: none;
}

.error-text {
    color: #d9534f;
    font-size: 13px;
    margin: 5px 0 10px;
    text-align: left;
}
</style>
