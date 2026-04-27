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
            icon: '',
            title: 'Free Shipping',
            subtitle: 'On orders over $100',
          },
          {
            icon: '',
            title: '24/7 Support',
            subtitle: 'Dedicated support',
          },
          {
            icon: '',
            title: 'Secure Payment',
            subtitle: '100% secure payment',

          },
          {
            icon: '',
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
          image: '/logo.png',
          alt: '4X4 Logo',
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
          { key: 'items', label: 'Feature Items', type: 'dynamic-features', fullWidth: true, fields: [
            { key: 'icon', label: 'Icon', type: 'image', placeholder: 'Upload icon' },
            { key: 'title', label: 'Title', type: 'text', placeholder: 'Feature title' },
            { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Feature subtitle' }
          ]}
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
          { key: 'logo.image', label: 'Logo Image', type: 'image', placeholder: 'Upload logo image' },
          { key: 'logo.alt', label: 'Logo Alt Text', type: 'text', placeholder: '4X4 Logo' },
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
        subtitle: '',
        backgroundImage: ''
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
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Enter contact hero subtitle', rows: 3 },
          { key: 'backgroundImage', label: 'Background Image', type: 'image' }
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
  },
  'about-us': {
    title: 'About Us Page',
    description: 'Manage your about us page content including hero section, company story, team members, mission, vision, and core values.',
    defaultContent: {
      heroSection: {
        title: '',
        subtitle: '',
        backgroundImage: ''
      },
      companyStory: {
        title: 'Our Story',
        description: '',
        foundedYear: '',
        backgroundImage: ''
      },
      mission: {
        title: 'Our Mission',
        description: '',
        icon: ''
      },
      vision: {
        title: 'Our Vision',
        description: '',
        icon: ''
      },
      values: {
        title: 'Our Core Values',
        items: [
          {
            title: 'Quality',
            description: 'We provide only the highest quality auto parts',
            icon: ''
          },
          {
            title: 'Integrity',
            description: 'We conduct business with honesty and transparency',
            icon: ''
          },
          {
            title: 'Customer Service',
            description: 'We prioritize customer satisfaction above all',
            icon: ''
          },
          {
            title: 'Innovation',
            description: 'We constantly seek new and better solutions',
            icon: ''
          }
        ]
      },
      team: {
        title: 'Meet Our Team',
        description: 'Get to know the people behind our success',
        members: []
      },
      stats: {
        title: 'Our Achievements',
        items: [
          {
            number: '10+',
            label: 'Years in Business'
          },
          {
            number: '50K+',
            label: 'Happy Customers'
          },
          {
            number: '1000+',
            label: 'Products Available'
          },
          {
            number: '24/7',
            label: 'Customer Support'
          }
        ]
      }
    },
    formSections: [
      {
        key: 'heroSection',
        title: 'Hero Section',
        fields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'About Us' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Learn more about our company and what drives us', rows: 3 },
          { key: 'backgroundImage', label: 'Background Image', type: 'image' }
        ]
      },
      {
        key: 'companyStory',
        title: 'Company Story',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Story' },
          { key: 'description', label: 'Story Description', type: 'textarea', placeholder: 'Tell your company story...', rows: 6, fullWidth: true },
          { key: 'foundedYear', label: 'Founded Year', type: 'text', placeholder: '2010' },
          { key: 'backgroundImage', label: 'Story Background Image', type: 'image' }
        ]
      },
      {
        key: 'mission',
        title: 'Mission',
        fields: [
          { key: 'title', label: 'Mission Title', type: 'text', placeholder: 'Our Mission' },
          { key: 'description', label: 'Mission Description', type: 'textarea', placeholder: 'Describe your mission...', rows: 4, fullWidth: true },
          { key: 'icon', label: 'Mission Icon', type: 'image' }
        ]
      },
      {
        key: 'vision',
        title: 'Vision',
        fields: [
          { key: 'title', label: 'Vision Title', type: 'text', placeholder: 'Our Vision' },
          { key: 'description', label: 'Vision Description', type: 'textarea', placeholder: 'Describe your vision...', rows: 4, fullWidth: true },
          { key: 'icon', label: 'Vision Icon', type: 'image' }
        ]
      },
      {
        key: 'values',
        title: 'Core Values',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Core Values' },
          { key: 'items', label: 'Values Items', type: 'dynamic-values', fullWidth: true }
        ]
      },
      {
        key: 'team',
        title: 'Team',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Meet Our Team' },
          { key: 'description', label: 'Team Description', type: 'textarea', placeholder: 'Get to know the people behind our success', rows: 3, fullWidth: true },
          { key: 'members', label: 'Team Members', type: 'dynamic-team', fullWidth: true }
        ]
      },
      {
        key: 'stats',
        title: 'Statistics/Achievements',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Achievements' },
          { key: 'items', label: 'Stats Items', type: 'dynamic-stats', fullWidth: true }
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
