# WhatsApp Integration for Eastleigh Turf Grass

This project now includes comprehensive WhatsApp integration that allows customers and brokers to submit forms directly to a WhatsApp number with formatted messages.

## 🚀 Features

- **Contact Form Integration**: Customer inquiries are sent directly to WhatsApp
- **Broker Dashboard Integration**: Orders, preorders, and price inquiries are sent to WhatsApp
- **Products Page Integration**: Cart checkout sends order details to WhatsApp
- **Formatted Messages**: Professional, structured messages with all relevant details
- **Easy Configuration**: Simple configuration file to update WhatsApp number and settings

## 📱 Setup Instructions

### 1. Update WhatsApp Number

Edit the file `public/js/config/whatsapp-config.js` and update the `PHONE_NUMBER` field:

```javascript
window.WhatsAppConfig = {
    // Your WhatsApp number (with country code, no + symbol)
    // Example: '254700000000' for Kenya
    PHONE_NUMBER: '254704505523', // ← Update this with your actual number
    
    // ... other settings
};
```

**Important**: 
- Use the international format without the `+` symbol
- For Kenya: `254700000000` (not `+254700000000`)
- For other countries, use the appropriate country code

### 2. Test the Integration

1. Start the development server:
   ```bash
   python -m http.server 8000
   ```

2. Test each form:
   - **Contact Form**: Go to `/contact.html` and submit a test inquiry
   - **Broker Dashboard**: Go to `/broker/` and test orders, preorders, or inquiries
   - **Products Page**: Go to `/products.html`, add items to cart, and checkout

3. Verify that WhatsApp opens with the formatted message

## 📋 Message Templates

### Contact Form Message
```
New Contact Form Submission - Eastleigh Turf Grass

Customer Details:
• Name: [Customer Name]
• Email: [Customer Email]
• Phone: [Customer Phone]

Project Details:
• Project Type: [Project Type]
• Area Size: [Area Size] m²
• Location: [Location]

Message:
[Customer Message]

Submitted: [Date and Time]
```

### Order Message
```
New Order Submission - Eastleigh Turf Grass

Broker Details:
• Name: [Broker Name]
• Email: [Broker Email]

Order Items:
• [Product Name] - Qty: [Quantity] - Price: KES [Price] - Total: KES [Total]

Order Summary:
• Total Items: [Count]
• Total Value: KES [Total Value]

Submitted: [Date and Time]
```

### Preorder Message
```
New Preorder Submission - Eastleigh Turf Grass

Broker Details:
• Name: [Broker Name]
• Email: [Broker Email]

Preorder Items:
• [Product Name] - Qty: [Quantity] - Unit Price: KES [Price] - Total: KES [Total]

Preorder Details:
• Expected Date: [Date]
• Special Notes: [Notes]
• Total Items: [Count]
• Total Value: KES [Total Value]

Submitted: [Date and Time]
```

### Price Inquiry Message
```
New Price Inquiry - Eastleigh Turf Grass

Broker Details:
• Name: [Broker Name]
• Email: [Broker Email]

Inquiry Items:
• [Product Name] - Original: KES [Original Price] - Bargain: KES [Bargain Price] - Difference: KES [Difference]

Inquiry Summary:
• Total Items: [Count]
• Total Original Value: KES [Original Total]
• Total Bargain Value: KES [Bargain Total]
• Total Savings: KES [Total Savings]

Submitted: [Date and Time]
```

## 🔧 Configuration Options

### WhatsApp Configuration (`public/js/config/whatsapp-config.js`)

```javascript
window.WhatsAppConfig = {
    // WhatsApp number (required)
    PHONE_NUMBER: '254700000000',
    
    // Company name for messages
    COMPANY_NAME: 'Eastleigh Turf Grass',
    
    // Default broker information
    DEFAULT_BROKER: {
        name: 'Broker User',
        email: 'broker@eastleighturf.com'
    },
    
    // Default customer information
    DEFAULT_CUSTOMER: {
        name: 'Customer',
        email: 'customer@example.com'
    },
    
    // Custom messages
    MESSAGES: {
        SUCCESS: 'Form submitted successfully! WhatsApp will open with your message.',
        ERROR: 'Failed to send message. Please try again.',
        LOADING: 'Sending...',
        VALIDATION: {
            REQUIRED_FIELDS: 'Please fill in all required fields',
            INVALID_EMAIL: 'Please enter a valid email address',
            EMPTY_CART: 'Please add items to your cart before checkout'
        }
    },
    
    // Currency settings
    CURRENCY: {
        CODE: 'KES',
        SYMBOL: 'KES',
        LOCALE: 'en-KE'
    }
};
```

## 📁 File Structure

```
public/js/
├── config/
│   └── whatsapp-config.js          # Configuration file
├── services/
│   └── whatsapp.js                 # WhatsApp service module
└── pages/
    └── contact.js                  # Contact form handler

broker/js/modules/
├── orders.js                       # Updated with WhatsApp integration
├── preorders.js                    # Updated with WhatsApp integration
└── inquiry.js                      # Updated with WhatsApp integration

public/js/components/
└── cart.js                         # Updated with WhatsApp checkout
```

## 🎯 How It Works

1. **Form Submission**: When a user submits a form, the JavaScript captures the data
2. **Data Formatting**: The data is formatted according to the message templates
3. **WhatsApp URL Generation**: A WhatsApp URL is created with the formatted message
4. **Browser Redirect**: The browser opens WhatsApp (web or app) with the pre-filled message
5. **User Confirmation**: The user can review and send the message in WhatsApp

## 🔒 Security Considerations

- **No Server Required**: This integration works entirely client-side
- **No Data Storage**: Form data is not stored, only sent via WhatsApp
- **User Control**: Users must manually send the message in WhatsApp
- **Privacy**: No sensitive data is transmitted to third-party services

## 🚨 Troubleshooting

### WhatsApp doesn't open
- Check that the phone number is in the correct format (no + symbol)
- Ensure the number is a valid WhatsApp number
- Test with a different browser

### Message is not formatted correctly
- Check the message templates in `whatsapp.js`
- Verify that form data is being captured correctly
- Check browser console for JavaScript errors

### Forms not working
- Ensure all required JavaScript files are loaded
- Check that the WhatsApp service is properly initialized
- Verify that the configuration file is loaded before the service

## 📞 Support

For technical support or questions about the WhatsApp integration:

1. Check the browser console for error messages
2. Verify the WhatsApp number format
3. Test with a simple message first
4. Ensure all files are properly loaded

## 🔄 Future Enhancements

Potential improvements for the WhatsApp integration:

- **Dynamic User Information**: Capture actual user names and emails
- **File Attachments**: Support for sending images/documents
- **Message Templates**: Allow customization of message formats
- **Analytics**: Track form submissions and WhatsApp interactions
- **Backup Methods**: Alternative contact methods if WhatsApp fails
