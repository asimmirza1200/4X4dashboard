export const cmsFormConfig = {
  home: {
    title: 'Home Page',
    description: 'Manage your home page content including hero section, deal zone, vehicle parts, categories, featured products, latest news, and promotions.',
    defaultContent: {
      heroSection: {
        title: '',
        subtitle: '',
        backgroundImage: ''
      },
      dealZone: {
        title: '',
        description: '',
        daysLabel: 'Days',
        hoursLabel: 'Hours',
        minutesLabel: 'Minutes',
        secondsLabel: 'Seconds',
        buttonText: 'View All Available Offers',
        noOffersMessage: 'No special offers available at the moment'
      },
      categories: {
        items: []
      },
      promotions: {
        items: []
      },
      featuredProducts: {
        title: '',
        description: ''
      },
      latestNews: {
        title: '',
        description: ''
      },
      
      cta: {
        title: '',
        subtitle: '',
        button: ''
      }
    },
    formSections: [
      {
        key: 'heroSection',
        title: 'Hero Section',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter hero title' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Enter hero subtitle', rows: 3 },
          { key: 'backgroundImage', label: 'Background Image', type: 'image' }
        ]
      },
      {
        key: 'dealZone',
        title: 'Deal Zone',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Deal Zone' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter deal zone description', rows: 3, fullWidth: true },
          { key: 'daysLabel', label: 'Days Label', type: 'text', placeholder: 'Days' },
          { key: 'hoursLabel', label: 'Hours Label', type: 'text', placeholder: 'Hours' },
          { key: 'minutesLabel', label: 'Minutes Label', type: 'text', placeholder: 'Minutes' },
          { key: 'secondsLabel', label: 'Seconds Label', type: 'text', placeholder: 'Seconds' },
          { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'View All Available Offers' },
          { key: 'noOffersMessage', label: 'No Offers Message', type: 'textarea', placeholder: 'No special offers available at the moment', rows: 2, fullWidth: true }
        ]
      },
      {
        key: 'categories',
        title: 'Categories',
        fields: [
          { key: 'items', label: 'Category Items', type: 'dynamic-categories', fullWidth: true }
        ]
      },
       {
        key: 'promotions',
        title: 'Promotions',
        fields: [
          { key: 'items', label: 'Promotion Items', type: 'dynamic-promotions', fullWidth: true }
        ]
      },
      {
        key: 'featuredProducts',
        title: 'Featured Products',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter featured products title' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter featured products description', rows: 3, fullWidth: true }
        ]
      },
      {
        key: 'latestNews',
        title: 'Latest News/Blog',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter latest news title' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter latest news description', rows: 3, fullWidth: true }
        ]
      },
      {
        key: 'cta',
        title: 'CTA',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter CTA title' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Enter CTA subtitle', rows: 3 },
          { key: 'button', label: 'Button Text', type: 'text', placeholder: 'Get Started' }
        ]
      }
    ]
  },
  shop: {
    title: 'Shop Page',
    description: 'Manage your shop page content including hero section and shop content with background image support.',
    defaultContent: {
      shopContent: {}
    },
    formSections: [
      {
        key: 'shopContent',
        title: 'Shop Content',
        fields: [
          { key: 'title', label: 'Shop Title', type: 'text', placeholder: 'Enter shop page title' },
          { key: 'description', label: 'Shop Description', type: 'textarea', placeholder: 'Enter shop page description', rows: 4, fullWidth: true },
          { key: 'backgroundImage', label: 'Background Image', type: 'image' },
          { key: 'qualityPoints', label: 'Quality Points', type: 'textarea', placeholder: 'Enter quality points (one per line): Quality Guaranteed\nFast Shipping\nBest Prices', rows: 4, fullWidth: true }
        ]
      }
    ]
  },
  contact: {
    title: 'Contact Page',
    description: 'Manage your contact page content including hero section, contact information, and customizable contact form.',
    defaultContent: {
      heroSection: {
        title: '',
        subtitle: ''
      },
      contactInfo: {
        address: '',
        phone: '',
        email: '',
        mondayFriday: '',
        saturday: '',
        sunday: '',
        contactForm: {
          title: 'Send Us A Message',
          fullNameLabel: 'Full Name',
          emailLabel: 'Email Address',
          phoneLabel: 'Phone Number',
          subjectLabel: 'Subject',
          messageLabel: 'Message'
        }
      }
    },
    formSections: [
      {
        key: 'heroSection',
        title: 'Hero Section',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter contact hero title' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Enter contact hero subtitle', rows: 3 }
        ]
      },
      {
        key: 'contactInfo',
        title: 'Contact Information',
        fields: [
          { key: 'address', label: 'Address', type: 'text', placeholder: 'Enter business address' },
          { key: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number' },
          { key: 'email', label: 'Email', type: 'text', placeholder: 'Enter email address' },
          { key: 'mondayFriday', label: 'Monday - Friday', type: 'text', placeholder: '9:00 AM - 6:00 PM' },
          { key: 'saturday', label: 'Saturday', type: 'text', placeholder: '10:00 AM - 4:00 PM' },
          { key: 'sunday', label: 'Sunday', type: 'text', placeholder: 'Closed' }
        ]
      }
    ]
  }
};

export const getPageTypes = () => {
  return Object.keys(cmsFormConfig).map(key => ({
    value: key,
    label: cmsFormConfig[key].title
  }));
};

export const getPageConfig = (pageType) => {
  return cmsFormConfig[pageType];
};
