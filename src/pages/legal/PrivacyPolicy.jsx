import React from 'react';
// Assuming you import the styles and data from './PolicyDataAndStyles'
import { styles, privacyData } from './PolicyDataAndStyles'; 
import Navbar from '../../components/Navbar';

// Reusable component for each policy section
const PolicySection = ({ title, content }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <p style={styles.sectionContent}>{content}</p>
    </div>
);

const PrivacyPolicy = () => {
    return (
        // FIX: Wrap everything in a single Fragment
        <> 
            <Navbar/>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.mainTitle}>Plattr Policy Center</h1>
                </header>

                <div style={styles.contentArea}>
                    <h2 style={styles.policyTitle}>{privacyData.title}</h2>
                    <p style={styles.updateDate}>{privacyData.lastUpdated}</p>

                    {privacyData.sections.map((section, index) => (
                        <PolicySection 
                            key={index} 
                            title={section.title} 
                            content={section.content} 
                        />
                    ))}
                </div>

                <footer style={styles.footer}>
                    <p>&copy; {new Date().getFullYear()} Plattr. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
};

export default PrivacyPolicy;