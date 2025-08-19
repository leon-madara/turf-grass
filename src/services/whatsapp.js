// WhatsApp Integration Service
(() => {
    // Get configuration
    const config = window.WhatsAppConfig || {
        PHONE_NUMBER: '254700000000',
        COMPANY_NAME: 'Eastleigh Turf Grass',
        DEFAULT_BROKER: { name: 'Broker User', email: 'broker@eastleighturf.com' },
        DEFAULT_CUSTOMER: { name: 'Customer', email: 'customer@example.com' },
        CURRENCY: { CODE: 'KES', SYMBOL: 'KES', LOCALE: 'en-KE' }
    };
    
    const WHATSAPP_NUMBER = config.PHONE_NUMBER;
    const COMPANY_NAME = config.COMPANY_NAME;
    
    // Message templates
    const MESSAGE_TEMPLATES = {
        contact: (data) => `*New Contact Form Submission - ${COMPANY_NAME}*

*Customer Details:*
• Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}

*Project Details:*
• Project Type: ${data.projectType}
• Area Size: ${data.areaSize ? data.areaSize + ' m²' : 'Not specified'}
• Location: ${data.location || 'Not specified'}

*Message:*
${data.message || 'No additional details provided'}

*Submitted:* ${new Date().toLocaleString('en-KE')}`,

        order: (data) => `*New Order Submission - ${COMPANY_NAME}*

*Broker Details:*
• Name: ${data.brokerName || 'Broker User'}
• Email: ${data.brokerEmail || 'broker@eastleighturf.com'}

*Order Items:*
${data.items.map(item => `• ${item.product.name} - Qty: ${item.quantity} - Price: KES ${item.unitPrice.toLocaleString()} - Total: KES ${item.total.toLocaleString()}`).join('\n')}

*Order Summary:*
• Total Items: ${data.items.length}
• Total Value: KES ${data.total.toLocaleString()}

*Submitted:* ${new Date().toLocaleString('en-KE')}`,

        preorder: (data) => `*New Preorder Submission - ${COMPANY_NAME}*

*Broker Details:*
• Name: ${data.brokerName || 'Broker User'}
• Email: ${data.brokerEmail || 'broker@eastleighturf.com'}

*Preorder Items:*
${data.items.map(item => `• ${item.product.name} - Qty: ${item.quantity} - Unit Price: KES ${item.unitPrice.toLocaleString()} - Total: KES ${item.total.toLocaleString()}`).join('\n')}

*Preorder Details:*
• Expected Date: ${data.expectedDate || 'Not specified'}
• Special Notes: ${data.specialNotes || 'None'}
• Total Items: ${data.items.length}
• Total Value: KES ${data.total.toLocaleString()}

*Submitted:* ${new Date().toLocaleString('en-KE')}`,

        inquiry: (data) => `*New Price Inquiry - ${COMPANY_NAME}*

*Broker Details:*
• Name: ${data.brokerName || 'Broker User'}
• Email: ${data.brokerEmail || 'broker@eastleighturf.com'}

*Inquiry Items:*
${data.items.map(item => `• ${item.product.name} - Original: KES ${item.originalPrice.toLocaleString()} - Bargain: KES ${item.bargainPrice.toLocaleString()} - Difference: KES ${(item.originalPrice - item.bargainPrice).toLocaleString()}`).join('\n')}

*Inquiry Summary:*
• Total Items: ${data.items.length}
• Total Original Value: KES ${data.totalOriginal.toLocaleString()}
• Total Bargain Value: KES ${data.totalBargain.toLocaleString()}
• Total Savings: KES ${(data.totalOriginal - data.totalBargain).toLocaleString()}

*Submitted:* ${new Date().toLocaleString('en-KE')}`
    };

    // Format phone number for WhatsApp
    function formatPhoneNumber(phone) {
        // Remove all non-digit characters
        let cleaned = phone.replace(/\D/g, '');
        
        // Handle Kenyan numbers
        if (cleaned.startsWith('254')) {
            return cleaned;
        } else if (cleaned.startsWith('0')) {
            return '254' + cleaned.substring(1);
        } else if (cleaned.startsWith('7')) {
            return '254' + cleaned;
        }
        
        return cleaned;
    }

    // Create WhatsApp URL
    function createWhatsAppURL(message) {
        const encodedMessage = encodeURIComponent(message);
        const formattedNumber = formatPhoneNumber(WHATSAPP_NUMBER);
        return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    }

    // Send message to WhatsApp
    function sendToWhatsApp(message, type = 'general') {
        try {
            const url = createWhatsAppURL(message);
            
            // Open WhatsApp in new tab/window
            window.open(url, '_blank');
            
            // Log for debugging
            console.log(`WhatsApp message sent (${type}):`, message);
            
            return true;
        } catch (error) {
            console.error('Failed to send WhatsApp message:', error);
            return false;
        }
    }

    // Send contact form
    function sendContactForm(formData) {
        const message = MESSAGE_TEMPLATES.contact(formData);
        return sendToWhatsApp(message, 'contact');
    }

    // Send order form
    function sendOrderForm(orderData) {
        const message = MESSAGE_TEMPLATES.order(orderData);
        return sendToWhatsApp(message, 'order');
    }

    // Send preorder form
    function sendPreorderForm(preorderData) {
        const message = MESSAGE_TEMPLATES.preorder(preorderData);
        return sendToWhatsApp(message, 'preorder');
    }

    // Send inquiry form
    function sendInquiryForm(inquiryData) {
        const message = MESSAGE_TEMPLATES.inquiry(inquiryData);
        return sendToWhatsApp(message, 'inquiry');
    }

    // Public API
    window.WhatsAppService = {
        sendContactForm,
        sendOrderForm,
        sendPreorderForm,
        sendInquiryForm,
        sendToWhatsApp,
        formatPhoneNumber
    };

})();
