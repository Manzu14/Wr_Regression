# Wr_Regression - Playwright Automation Framework

A comprehensive Playwright-based automation testing framework for web application regression testing, focusing on booking management and amendment flows.

## 🚀 Features

- **Page Object Model (POM)** - Structured and maintainable test architecture
- **ES Modules** - Modern JavaScript module system
- **Price Validation** - Automated cost verification for amendments
- **Multi-Amendment Support** - Name, insurance, baggage, seat, and flight changes
- **Lead/Non-Lead Passenger** - Separate flows for different passenger types
- **Cross-Browser Testing** - Support for Chrome, Firefox, and Safari
- **Detailed Reporting** - Comprehensive test results and screenshots

## 📋 Test Coverage

### Amendment Flows
- ✅ **Name Amendment** - Lead passenger (€82) and non-lead passenger (€62)
- ✅ **Insurance Amendment** - Travel insurance changes (€72)
- ✅ **Baggage Amendment** - Additional baggage options
- ✅ **Seat Amendment** - Seat selection and upgrades
- ✅ **Flight Amendment** - Flight change requests
- ✅ **Booking Cancellation** - Complete booking cancellation flow

### Validation Types
- Price validation across all amendment types
- Form field validation and error handling
- Navigation flow verification
- Review and confirmation page checks

## 🛠️ Tech Stack

- **Playwright** - Cross-browser automation
- **JavaScript (ES6+)** - Modern JavaScript features
- **Node.js** - Runtime environment
- **Page Object Model** - Design pattern for maintainability

## 📁 Project Structure

```
wr_automation/
├── pages/                          # Page Object Models
│   ├── package/
│   │   ├── PaxUpgradePage.js      # Lead passenger amendments
│   │   ├── NonLeadPaxUpgradePage.js # Non-lead passenger amendments
│   │   ├── InsuranceUpgrade.js     # Insurance amendment flows
│   │   ├── BaggageUpgradePage.js   # Baggage upgrade options
│   │   ├── ReviewAndConfirm.js     # Price validation & confirmation
│   │   └── ManageBookingPage.js    # Booking management entry
│   └── HomePage.js                 # Application entry point
├── tests/
│   └── pk/mmb/                     # Manage My Booking tests
│       ├── nameAmand.spec.js       # Lead passenger name tests
│       ├── nonLeadPaxAmend.spec.js # Non-lead passenger tests
│       ├── insuranceAmand.spec.js  # Insurance amendment tests
│       ├── baggageAmand.spec.js    # Baggage amendment tests
│       └── smokePack.spec.js       # Smoke test suite
├── test-data/
│   └── testData.js                 # Test data configuration
└── utils/
    └── reporters/                  # Custom reporting utilities
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Manzu14/Wr_Regression.git
cd Wr_Regression
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install
```

### Configuration

Update test data in `test-data/testData.js`:
```javascript
export const testData = {
  nameAmendment: "YOUR_BOOKING_REFERENCE",
  // Add other test data as needed
};
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
# Name amendment tests
npx playwright test tests/pk/mmb/nameAmand.spec.js

# Non-lead passenger tests
npx playwright test tests/pk/mmb/nonLeadPaxAmend.spec.js

# Insurance amendment tests
npx playwright test tests/pk/mmb/insuranceAmand.spec.js

# Smoke tests
npx playwright test tests/pk/mmb/smokePack.spec.js
```

### Run with specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Generate test report
```bash
npx playwright show-report
```

## 💰 Price Validation

The framework includes comprehensive price validation for different amendment types:

| Amendment Type | Price | Validation Method |
|---------------|-------|-------------------|
| Lead Passenger Name | €82 | `validateLeadNameAmendmentPrice()` |
| Non-Lead Passenger Name | €62 | `validateNonLeadNameAmendmentPrice()` |
| Insurance | €72 | `validateInsuranceAmendmentPrice()` |
| Baggage | Variable | `validateBaggageAmendmentPrice()` |

## 🔧 Key Features

### Page Object Model
- Centralized element locators
- Reusable methods across tests
- Easy maintenance and updates

### Price Validation System
- Automated cost verification
- Summary and review page validation
- Detailed logging for debugging

### Multi-Passenger Support
- Lead passenger (limited surname editing)
- Non-lead passenger (full name editing)
- Different pricing structures

### Error Handling
- Timeout management
- Element waiting strategies
- Graceful failure handling

## 📊 Test Reports

Tests generate detailed reports including:
- Test execution results
- Screenshots on failures
- Performance metrics
- Cross-browser compatibility results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-test`)
3. Commit your changes (`git commit -m 'Add new test scenario'`)
4. Push to the branch (`git push origin feature/new-test`)
5. Open a Pull Request

## 📝 Test Data Management

Test data is centralized in `test-data/testData.js`:
- Booking references for different scenarios
- User credentials (if needed)
- Environment-specific configurations

## 🐛 Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Increase timeout values in page objects
   - Check element selectors
   - Verify page load states

2. **Price Validation Failures**
   - Verify expected prices in test data
   - Check currency formatting
   - Validate selector accuracy

3. **Element Not Found**
   - Update selectors if UI changes
   - Add proper wait conditions
   - Check page navigation flow

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Manzu14** - *Initial work* - [GitHub Profile](https://github.com/Manzu14)

## 🔗 Links

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [JavaScript ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)