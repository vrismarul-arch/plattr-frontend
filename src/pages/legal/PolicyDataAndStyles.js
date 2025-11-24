// --- Terms & Conditions Data ---
export const termsData = {
    // Replaced 📝 with suggested AntD Icon component name
    title: "FileTextOutlined Terms & Conditions", 
    lastUpdated: "Last Updated: 19 November 2025",
    sections: [
        {
            title: "1. Service Availability",
            content: "Plattr provides home delivery of fruits, sprouts, nuts, and diet-based meal boxes. Service is available only in designated delivery areas.",
        },
        {
            title: "2. Orders & Payments",
            content: "All orders must be confirmed and paid in full before preparation and delivery. Prices may vary based on market conditions.",
        },
        {
            title: "3. Delivery",
            content: "Delivery timing may vary based on location and availability. Plattr is not responsible for delays caused by weather, traffic, or unforeseen situations.",
        },
        {
            title: "4. Cancellations & Refunds",
            content: "Orders cannot be cancelled once prepared. Refunds are provided only for valid quality-related issues, reviewed case by case.",
        },
        {
            title: "5. Quality & Freshness",
            content: "We ensure fresh ingredients for every order. Customers must check their items upon delivery; issues reported after 1 hour may not be eligible for replacement.",
        },
        {
            title: "6. Health Disclaimer",
            content: "Our meals are prepared for general dietary purposes. Customers with allergies or medical conditions must inform us before ordering.",
        },
        {
            title: "7. Changes to Terms",
            content: "Plattr may update these Terms & Conditions without prior notice.",
        },
    ],
};

// --- Privacy Policy Data ---
export const privacyData = {
    // Replaced 🔒 with suggested AntD Icon component name
    title: "LockOutlined Privacy Policy", 
    lastUpdated: "Last Updated: 19 November 2025",
    sections: [
        {
            title: "1. Information We Collect",
            content: "We collect basic details such as name, phone number, address, and order preferences to process and deliver orders.",
        },
        {
            title: "2. Use of Information",
            content: "Your information is used only for order processing, delivery, customer support, and service improvement.",
        },
        {
            title: "3. Data Protection",
            content: "We do not sell, rent, or share personal information with third parties except for delivery purposes or when legally required.",
        },
        {
            title: "4. Payments",
            content: "All payment information is handled securely through trusted payment partners. We do not store card or bank details.",
        },
        {
            title: "5. Cookies & Analytics",
            content: "Our website may use cookies to enhance user experience and analyze page performance.",
        },
        {
            title: "6. User Rights",
            content: "Customers may request correction or deletion of their personal information at any time by contacting us.",
        },
        {
            title: "7. Policy Updates",
            content: "Plattr reserves the right to modify this Privacy Policy when necessary.",
        },
    ],
};

// --- Inline Styles (CSS-in-JS) for Mobile-First & Responsive UI ---
export const styles = {
    container: {
        margin: '0 auto',
        padding: '0 15px',
        lineHeight: 1.6,
        color: '#333',
    },
    header: {
        textAlign: 'center',
        padding: '20px 0',
        borderBottom: '2px solid #ddd',
        marginBottom: '20px',
    },
    mainTitle: {
        color: '#000000ff', // Green color (Plattr branding)
        fontSize: '28px',
        margin: 0,
    },
    contentArea: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        minHeight: '70vh', 
    },
    policyTitle: {
        fontSize: '1.8em',
        color: '#343a40',
        marginBottom: '10px',
        borderBottom: '3px solid #e9ecef',
        paddingBottom: '10px',
    },
    updateDate: {
        fontSize: '0.9em',
        color: '#6c757d',
        marginBottom: '30px',
        textAlign: 'right',
    },
    section: {
        marginBottom: '20px',
        paddingLeft: '15px',
        // Restored Green Accent Line from earlier professional styles
    },
    sectionTitle: {
        fontSize: '1.2em',
        color: '#495057',
        fontWeight: 'bold',
        marginTop: 0,
    },
    sectionContent: {
        fontSize: '1em',
        color: '#333',
        margin: '5px 0 0 0',
    },
    footer: {
        textAlign: 'center',
        padding: '20px 0',
        marginTop: '30px',
        borderTop: '1px solid #ddd',
        fontSize: '0.85em',
        color: '#6c757d',
    }
};