<template>
    <div v-if="isOpen" class="team-overlay" @click.self="close">
        <div class="team-modal">
            <header class="team-header">
                <h3>Meet The Team</h3>
                <button class="close" @click="close">&times;</button>
            </header>

            <div class="team-body">
                <div class="members-grid">
                    <div v-for="m in members" :key="m.id" class="member-card">
                        <div class="avatar-container">
                            <img :src="m.avatar" :alt="m.name" class="avatar" />
                        </div>

                        <div class="member-info">
                            <div class="name">{{ m.name }}</div>
                            <div class="role">{{ m.role }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <footer class="team-footer">
                <button class="ok-btn" @click="close">Close</button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import team from '@/data/team.js';

/* eslint-disable no-undef */
// 👇 Removed 'const props =' to fix unused variable error
defineProps({
    isOpen: Boolean
});

const emit = defineEmits(['close']);
/* eslint-enable no-undef */

const members = computed(() => team);

const close = () => emit('close');
</script>

<style scoped>
.team-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1200;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.team-modal {
    background: #fff;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.team-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background: #f9f9f9;
}

.team-header h3 {
    margin: 0;
    color: #333;
    font-size: 20px;
}

.team-header .close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    line-height: 1;
}

.team-body {
    padding: 20px;
    overflow-y: auto;
}

.members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.member-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
}

.member-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border-color: #e6b34e;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e6b34e;
    padding: 2px;
    background: white;
}

.member-info .name {
    font-weight: 700;
    color: #333;
    font-size: 16px;
    margin-bottom: 5px;
}

.member-info .role {
    font-size: 13px;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.team-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    text-align: right;
    background: #f9f9f9;
}

.ok-btn {
    background: #e6b34e;
    color: white;
    border: none;
    padding: 8px 25px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.ok-btn:hover {
    background: #d6a23e;
}
</style>