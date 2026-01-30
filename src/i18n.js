import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        // Navigation
        nav: { 
            home: 'Home', 
            promotions: 'Promotions', 
            arrivals: 'New Arrivals', 
            categories: 'Top Categories', 
            sellers: 'Top Sellers' 
        },
        
        // Header
        header: { 
            searchPlaceholder: 'Search Product ...', 
            compare: 'Compare', 
            wishlist: 'Wishlist', 
            cart: 'Cart', 
            login: 'Login', 
            register: 'Register',
            hello: 'Hi',
            logout: 'Logout',
            profile: 'Profile',
            langEn: 'English',
            langKh: 'Khmer'
        },

        // Home Page Sections
        home: {
            bestSelling: 'Best Selling',
            personalCare: 'Personal Care',
            trending: 'Trending Now',
            classics: 'Classic Literature',
            children: 'Children\'s Books'
        },

        // Common Buttons & Labels
        common: {
            viewMore: 'View More >>',
            shopNow: 'Shop Now',
            explore: 'Explore',
            readMore: 'Read More'
        },

        // Product Card
        product: {
            discountOff: 'OFF',
            addToCart: 'Add to Cart',
            outOfStock: 'Out of Stock'
        },

        // Sidebar (Cart, Wishlist, Compare)
        sidebar: {
            cartTitle: 'Shopping Cart',
            wishlistTitle: 'My Wishlist',
            compareTitle: 'Compare Products',
            empty: 'Your list is empty.',
            total: 'Total:',
            viewCart: 'View Full Cart',
            checkout: 'Checkout'
        },

        // Checkout Form
        checkout: {
            title: 'Checkout',
            shippingInfo: 'Shipping Information',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address (Optional)',
            address: 'Street Address',
            country: 'Select Country',
            cambodia: 'Cambodia',
            phone: 'Phone Number',
            deliveryService: 'Delivery Service',
            virak: 'Virak Butham',
            jne: 'JNT Express',
            orderSummary: 'Order Summary',
            subtotal: 'Subtotal:',
            shipping: 'Shipping:',
            total: 'Total:',
            placeOrder: 'Place Order',
            qrScan: 'Scan QR Code to Verify',
            qrVerify: 'QR Code Verified',
            qrError: 'QR Code verification failed'
        },

        // Authentication
        auth: {
            loginTitle: 'Login',
            registerTitle: 'Register',
            email: 'Email',
            password: 'Password',
            logout: 'Logout'
        },

        profile: {
            title: 'My Profile',
            subtitle: 'Account details',
            accountInfo: 'Account Information',
            memberSince: 'Member since:',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            role: 'Role',
            address: 'Address',
            edit: 'Edit Profile',
            cancel: 'Cancel',
            save: 'Save Changes',
            saving: 'Saving...',
            changePhoto: 'Change Photo',
            uploading: 'Uploading...',
            logout: 'Logout'
        },

        // Invoice / Order
        invoice: {
            title: 'Invoice',
            downloadPDF: 'Download PDF',
            downloadPNG: 'Download PNG',
            invoiceNumber: 'Invoice #',
            billingTo: 'Billing To',
            items: 'Items',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            total: 'Total'
        },

        // Additional invoice texts
        invoiceExtra: {
            thankYou: 'Thank you for your purchase!',
            shippingTo: 'Shipping To:',
            orderItems: 'Order Items',
            deliveryService: 'Delivery Service',
            continue: 'Continue Shopping',
            supportContact: 'For support, contact us at vue7@team.com',
            invoiceDate: 'Invoice Date:'
        },

        // Compare warnings
        compare: {
            limitWarning: 'You can only compare up to 3 items. 🙏🙏🙏'
        },

        // Footer
        footer: {
            about: 'About Us',
            contact: 'Contact Us',
            followUs: 'Follow Us',
            copyright: '© 2026 MarketPlace. All Rights Reserved.',
            desc: 'Your one-stop shop for books, personal care, and more. Quality products at the best prices.'
        }
    },

    kh: {
        // Navigation
        nav: { 
            home: 'ទំព័រដើម', 
            promotions: 'ប្រូម៉ូសិន', 
            arrivals: 'ទំនិញថ្មី', 
            categories: 'ប្រភេទពេញនិយម', 
            sellers: 'អ្នកលក់ឆ្នើម' 
        },

        // Header
        header: { 
            searchPlaceholder: 'ស្វែងរកទំនិញ ...', 
            compare: 'ប្រៀបធៀប', 
            wishlist: 'ចំណូលចិត្ត', 
            cart: 'កន្ត្រក់', 
            login: 'ចូលគណនី', 
            register: 'ចុះឈ្មោះ',
            hello: 'Hi',
            logout: 'Logout',
            profile: 'Profile',
            langEn: 'អង់គ្លេស',
            langKh: 'ខ្មែរ'
        },

        // Home Page Sections
        home: {
            bestSelling: 'លក់ដាច់បំផុត',
            personalCare: 'ការថែទាំផ្ទាល់ខ្លួន',
            trending: 'កំពុងពេញនិយម',
            classics: 'អក្សរសិល្ប៍បុរាណ',
            children: 'សៀវភៅកុមារ'
        },

        // Common Buttons & Labels
        common: {
            viewMore: 'មើលបន្ថែម >>',
            shopNow: 'ទិញឥឡូវនេះ',
            explore: 'ស្វែងយល់',
            readMore: 'អានបន្ថែម'
        },

        // Product Card
        product: {
            discountOff: 'បញ្ចុះតម្លៃ', // or simply "%"
            addToCart: 'ដាក់ចូលកន្ត្រក',
            outOfStock: 'អស់ពីស្តុក'
        },

        // Sidebar (Cart, Wishlist, Compare)
        sidebar: {
            cartTitle: 'កន្ត្រកទំនិញ',
            wishlistTitle: 'បញ្ជីដែលចូលចិត្ត',
            compareTitle: 'ប្រៀបធៀបទំនិញ',
            empty: 'បញ្ជីរបស់អ្នកគឺទទេ',
            total: 'សរុប:',
            viewCart: 'មើលកន្ត្រកពេញ',
            checkout: 'ទូទាត់ប្រាក់'
        },

        // Checkout Form
        checkout: {
            title: 'ទូទាត់ប្រាក់',
            shippingInfo: 'ព័ត៌មាន',
            firstName: 'នាម',
            lastName: 'គោត្តនាម',
            email: 'អាសយដ្ឋានអ៊ីម៉ែល (មិនតម្រូវ)',
            address: 'សូមដាក់ទីតាំង',
            country: 'ជ្រើសរើសប្រទេស',
            cambodia: 'កម្ពុជា',
            phone: 'លេខទូរស័ព្ទ',
            deliveryService: 'សេវាកម្មដឹកជញ្ជូន',
            virak: 'វីរៈប៊ុនថាំ',
            jne: 'JNT',
            orderSummary: 'សង្ខេបលម្អិតលេខបញ្ជាទិញ',
            subtotal: 'សរុបរង:',
            shipping: 'ការដឹកជញ្ជូន:',
            total: 'សរុប:',
            placeOrder: 'ដាក់លម្អិតលេខបញ្ជាទិញ',
            qrScan: 'ស្កេន QR',
            qrVerify: 'ផ្ទៀងផ្ទាត់លេខ QR បានជោគជ័យ',
            qrError: 'ផ្ទៀងផ្ទាត់លេខ QR បរាជ័យ'
        },

        // Authentication
        auth: {
            loginTitle: 'ចូលគណនី',
            registerTitle: 'ចុះឈ្មោះ',
            email: 'អ៊ីមែល',
            password: 'ពាក្យសម្ងាត់',
            logout: 'ចាកចេញ'
        },

        profile: {
            title: 'My Profile',
            subtitle: 'Account details',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            role: 'Role',
            address: 'Address',
            logout: 'Logout'
        },

        // Invoice / Order
        invoice: {
            title: 'វិក័យប័ត្រ',
            downloadPDF: 'ទាញយកជា PDF',
            downloadPNG: 'ទាញយកជា PNG',
            invoiceNumber: 'លេខវិក័យប័ត្រ',
            billingTo: 'ចេញវិក័យប័ត្រ​ទៅ',
            items: 'ទំនិញ',
            subtotal: 'សរុបរង',
            shipping: 'ការដឹកជញ្ជូន',
            total: 'សរុប'
        },

        invoiceExtra: {
            thankYou: 'សូមអរគុណចំពោះការទិញរបស់លោកអ្នក!',
            shippingTo: 'ផ្ញើទៅ:',
            orderItems: 'ទំនិញនៅក្នុងការបញ្ជាទិញ',
            deliveryService: 'សេវាកម្មដឹកជញ្ជូន',
            continue: 'អរគុណ',
            supportContact: 'សម្រាប់ជំនួយ សូមទាក់ទង vue7@team.com',
            invoiceDate: 'កាលបរិច្ឆេទវិក័យប័ត្រ:'
        },

        // Compare warnings
        compare: {
            limitWarning: 'អ្នកអាចប្រៀបធៀបបានតែ 3 ផលិតផលប៉ុណ្ណោះ។ 🙏🙏🙏'
        },

        // Footer
        footer: {
            about: 'អំពីយើង',
            contact: 'ទំនាក់ទំនង',
            followUs: 'តាមដានយើង',
            copyright: 'រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៦ MarketPlace',
            desc: 'ហាងលក់សៀវភៅ និងផលិតផលថែទាំផ្ទាល់ខ្លួនដែលអ្នកទុកចិត្ត។ ផលិតផលមានគុណភាពជាមួយតម្លៃសមរម្យ។'
        }
    }
};

// Get saved language from localStorage, default to 'en'
const savedLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages
});

export default i18n;
