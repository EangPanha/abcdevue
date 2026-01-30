<template>
    <footer class="app-footer">
        <div class="container">
            <div class="footer-grid">

                <div class="footer-col contact-col">
                    <h3>CONTACT INFO</h3>
                    <p>Address: #10A, St. 598, Boeung Kak 2, Toul Kork, Phnom Penh, Cambodia.</p>
                    <p>Phone: xxxxxxxxxxx</p>
                    <p>Email: vue7@team.com</p>

                    <div class="logo-area">
                        <h2 class="footer-logo">&copy; TEAM 7</h2>
                    </div>

                    <div class="subscribe-box">
                        <input type="text" placeholder="Your Email Address" />
                        <button>Subscribe</button>
                    </div>

                    <div class="app-buttons">
                        <button class="store-btn"><i class="fa-brands fa-google-play"></i> Get it on<br><strong>Google
                                Play</strong></button>
                        <button class="store-btn"><i class="fa-brands fa-apple"></i> Available on the<br><strong>App
                                Store</strong></button>
                    </div>
                        <button class="team-btn" @click="openTeam">Meet The Team</button>
                    </div>

                <div class="footer-col">
                    <h3>CUSTOMER SUPPORT</h3>
                    <ul>
                        <li><a href="#">Terms & conditions</a></li>
                        <li><a href="#">Return Policy</a></li>
                        <li><a href="#">Delivery Policy</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>

                    <div class="social-section">
                        <h3>MEET US ON</h3>
                        <div class="social-icons">
                            <a href="#" class="social-btn fb"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="#" class="social-btn ig"><i class="fa-brands fa-instagram"></i></a>
                            <a href="#" class="social-btn in"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>

                <div class="footer-col">
                    <h3>WE ACCEPT</h3>
                    <div class="payment-icons">
                        <i class="fa-brands fa-cc-visa"></i>
                        <i class="fa-brands fa-cc-mastercard"></i>
                        <i class="fa-brands fa-cc-jcb"></i>
                        <i class="fa-regular fa-credit-card"></i>
                    </div>
                </div>

                <div class="footer-col">
                    <h3>MY ACCOUNT</h3>
                    <ul>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Order History</a></li>
                        <li><a href="#">My Wishlist</a></li>
                        <li><a href="#">Track Order</a></li>
                    </ul>

                    <div class="merchant-section">
                        <h3>BE A MERCHANT</h3>
                        <button class="apply-btn">Apply Now</button>
                    </div>
                </div>

            </div>
        </div>

        <div class="copyright">
            <p>Copyright ©2023 Phsar121 (Cambodia). All rights reserved.</p>
        </div>
.    <TeamModal :isOpen="isTeamOpen" @close="closeTeam" />
    </footer>
</template>

<script setup>
import { ref } from 'vue';
import TeamModal from '@/components/TeamModal.vue';

const isTeamOpen = ref(false);
const openTeam = () => { isTeamOpen.value = true; };
const closeTeam = () => { isTeamOpen.value = false; };
</script>

<style scoped>
.app-footer {
    background-color: #0f1724;
    /* Dark blue background */
    color: #fff;
    padding-top: 50px;
    font-size: 14px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    /* First column is wider */
    gap: 30px;
    padding-bottom: 40px;
}

h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase;
}

p {
    color: #b0b8c4;
    line-height: 1.6;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin-bottom: 12px;
}

ul li a {
    color: #b0b8c4;
    text-decoration: none;
    transition: 0.2s;
}

ul li a:hover {
    color: #e6b34e;
}

/* Subscribe Box */
.subscribe-box {
    display: flex;
    margin: 20px 0;
}

.subscribe-box input {
    padding: 10px;
    border: none;
    border-radius: 4px 0 0 4px;
    flex: 1;
}

.subscribe-box button {
    background: #e6b34e;
    border: none;
    padding: 10px 20px;
    color: white;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-weight: bold;
}

/* App Buttons */
.app-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.store-btn {
    background: #1a2332;
    border: 1px solid #333;
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-align: left;
    font-size: 11px;
}

.store-btn i {
    font-size: 20px;
}

.store-btn strong {
    display: block;
    font-size: 13px;
}

/* Social Icons */
.social-icons {
    display: flex;
    gap: 10px;
}

.social-btn {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-decoration: none;
}

.fb {
    background: #3b5998;
}

.ig {
    background: #d62976;
}

.in {
    background: #0077b5;
}

/* Payment Icons */
.payment-icons i {
    font-size: 30px;
    margin-right: 10px;
    color: white;
}

/* Apply Button */
.apply-btn {
    background: #e6b34e;
    border: none;
    padding: 10px 25px;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
}

/* Copyright */
.copyright {
    background-color: #0a0f18;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #1f293a;
    color: #777;
}

/* Responsive */
@media (max-width: 900px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .footer-grid {
        grid-template-columns: 1fr;
    }
}
</style>