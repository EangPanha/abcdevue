<template>
    <div class="page-wrapper">
        <AppHeader />

        <main class="main-content">
            <div class="auth-container">
                <div class="auth-box">
                    <h2>{{ $t('header.register') }}</h2>
                    <p>Create a new account to start shopping.</p>

                    <form @submit.prevent="handleRegister">
                        <div class="form-group">
                            <label>{{ $t('header.register') }}</label>
                            <input class="khmer-text" type="text" placeholder="John Doe" required />
                        </div>

                        <div class="form-group">
                            <label>{{ $t('auth.email') }}</label>
                            <input class="khmer-text" type="email" placeholder="email@example.com" required />
                        </div>

                        <div class="form-group">
                            <label>{{ $t('auth.password') }}</label>
                            <input class="khmer-text" type="password" placeholder="Create a password" required />
                        </div>

                        <div class="form-group">
                            <label>{{ $t('auth.password') }}</label>
                            <input class="khmer-text" type="password" placeholder="Confirm your password" required />
                        </div>

                        <button type="submit" class="auth-btn">{{ $t('header.register') }}</button>
                    </form>

                    <div class="auth-footer">
                        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
                    </div>
                </div>
            </div>
        </main>

        <AppFooter />
    </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const handleRegister = () => {
    alert("Registration functionality coming soon!");
};
</script>

<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f6f8;
}

.main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}

.auth-container {
    width: 100%;
    max-width: 400px;
    padding: 0 15px;
}

.auth-box {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 10px;
}

.auth-box p {
    text-align: center;
    color: #666;
    margin-bottom: 30px;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: bold;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    transition: 0.3s;
}

.form-group input:focus {
    border-color: #e6b34e;
}

.auth-btn {
    width: 100%;
    background: #e6b34e;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.auth-btn:hover {
    background: #d6a23e;
}

.auth-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.auth-footer a {
    color: #e6b34e;
    text-decoration: none;
    font-weight: bold;
}
</style>