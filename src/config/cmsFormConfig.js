export const cmsFormConfig = {
  home: {
    title: 'Home Page',
    description: 'Manage your home page content including hero section, deal zone, vehicle parts, categories, featured products, latest news, promotions, header, and footer.',
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
      },
      features: {
        title: 'Our Services',
        items: [
          {
            title: 'Free Shipping',
            subtitle: 'On orders over $100',
          },
          {
            title: '24/7 Support',
            subtitle: 'Dedicated support',
          },
          {
            title: 'Secure Payment',
            subtitle: '100% secure payment',

          },
          {
            title: 'Hot Offers',
            subtitle: 'Discounts up to 50%',
          }
        ]
      },
      header: {
        topbar: {
          callus:{
            title: 'Call Us:',
            phone: '+1 (555) 123-4567'
          },
         leftLinks: [
  { title: 'About Us', url: '/about-us' },
  { title: 'Contact', url: '/contact-us' },
  { title: 'Track Order', url: '/track-order' }
],
 rightLinks: [
  { title: 'Compare', url: '/compare' }
],
        },
        logo: {
          mainText: '4X4',
          slogan: 'Auto parts for Cars, trucks and motorcycles'
        },
       navigation: {
  items: [
    { title: 'Home', url: '/' },
    { title: 'Shop', url: '/shop' },
    { title: 'Blog', url: '/blog' },
    { title: 'Builds', url: '/builds' },
    { title: 'Add My Build', url: '/add-build' },
    { title: 'Community', url: '/community' }
  ]
},
        indicators: {
          showWishlist: true,
          showAccount: true,
          showCart: true
        }
      },
      footer: {
        brand: {
          name: 'All4x4',
          subtitle: 'Auto Parts',
          description: 'Your trusted source for quality auto parts and accessories.',
          logo: ''
        },
        shopLinks: {
          title: 'Shop',
          items: [
    { title: 'All Products', url: '/shop' },
    { title: 'New Arrivals', url: '/shop?sort=newest' },
    { title: 'Special Offers', url: '/shop?onSale=true' },
    { title: 'Best Sellers', url: '/shop?sort=popular' }
  ]
        },
        accountLinks: {
          title: 'Account',
          items: [
            { title: 'My Account', url: '/account/dashboard' },
            { title: 'Order History', url: '/account/orders' },
            { title: 'Wishlist', url: '/wishlist' },
            { title: 'My Garage', url: '/account/garage' }
          ]
        },
        companyLinks: {
          title: 'Company',
          items: [
            { title: 'Contact Us', url: '/contact-us' },
            { title: 'Blog', url: '/blog' },
            { title: 'FAQ', url: '/faq' },
            { title: 'About Us', url: '/about-us' }
          ]
        },
        legalLinks: {
          items: [
            { title: 'Terms & Conditions', url: '/terms-&-conditions' },
            { title: 'Privacy Policy', url: '/privacy-policy' },
            { title: 'Refund & Returns', url: '/refund-&-returns' }
          ]
        },
        socialMedia: {
          facebook: '#',
          twitter: '#',
          instagram: '#'
        },
        copyright: {
          companyName: 'All4x4'
        }
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
        key: 'features',
        title: 'Features/Services',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Services' },
          { key: 'items', label: 'Feature Items', type: 'dynamic-features', fullWidth: true }
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
      },
      {
        key: 'header',
        title: 'Header',
        fields: [
          { key: 'topbar.callus.title', label: 'Call Us Title', type: 'text', placeholder: 'Call Us:' },
          { key: 'topbar.callus.phone', label: 'Phone Number', type: 'text', placeholder: '(800) 060-0730' },
          { key: 'topbar.leftLinks', label: 'Top Bar Left Links ',  type: 'dynamic-links', fullWidth: true },
          { key: 'topbar.rightLinks', label: 'Top Bar Right Links ',  type: 'dynamic-links', fullWidth: true },
          { key: 'logo.mainText', label: 'Logo Main Text', type: 'text', placeholder: '4X4' },
          { key: 'logo.slogan', label: 'Logo Slogan', type: 'text', placeholder: 'Auto parts for Cars, trucks and motorcycles' },
         { 
  key: 'navigation.items', 
  label: 'Navigation Menu', 
  type: 'dynamic-links', 
  fullWidth: true 
},
          { key: 'indicators.showWishlist', label: 'Show Wishlist', type: 'checkbox' },
          { key: 'indicators.showAccount', label: 'Show Account', type: 'checkbox' },
          { key: 'indicators.showCart', label: 'Show Cart', type: 'checkbox' }
        ]
      },
      {
        key: 'footer',
        title: 'Footer',
        fields: [
          { key: 'brand.name', label: 'Brand Name', type: 'text', placeholder: 'All4x4' },
          { key: 'brand.subtitle', label: 'Brand Subtitle', type: 'text', placeholder: 'Auto Parts' },
          { key: 'brand.description', label: 'Brand Description', type: 'textarea', placeholder: 'Enter brand description', rows: 3, fullWidth: true },
         { key: 'shopLinks.items', label: 'Shop Links', type: 'dynamic-links', fullWidth: true },
{ key: 'accountLinks.items', label: 'Account Links', type: 'dynamic-links', fullWidth: true },
{ key: 'companyLinks.items', label: 'Company Links', type: 'dynamic-links', fullWidth: true },
{ key: 'legalLinks.items', label: 'Legal Links', type: 'dynamic-links', fullWidth: true },
          { key: 'socialMedia.facebook', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/yourpage' },
          { key: 'socialMedia.twitter', label: 'Twitter URL', type: 'text', placeholder: 'https://twitter.com/yourpage' },
          { key: 'socialMedia.instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/yourpage' },
          { key: 'copyright.companyName', label: 'Copyright Company Name', type: 'text', placeholder: 'All4x4' }
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
