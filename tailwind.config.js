/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requires this preset
  presets: [require('nativewind/preset')],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Color - Cyan (Food delivery theme)
        primary: {
          DEFAULT: '#00BCD4',
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        
        // Secondary - Orange (Complementary for food/action)
        secondary: {
          DEFAULT: '#FF9800',
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        
        // Accent - Deep Orange (For highlights & CTAs)
        accent: {
          DEFAULT: '#FF5722',
          50: '#FBE9E7',
          100: '#FFCCBC',
          200: '#FFAB91',
          300: '#FF8A65',
          400: '#FF7043',
          500: '#FF5722',
          600: '#F4511E',
          700: '#E64A19',
          800: '#D84315',
          900: '#BF360C',
        },
        
        // Success - Green (Order status, ratings)
        success: {
          DEFAULT: '#4CAF50',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        
        // Warning - Amber (Alerts, pending status)
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        
        // Error - Red (Errors, cancellations)
        error: {
          DEFAULT: '#F44336',
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        
        // Info - Blue (Information, links)
        info: {
          DEFAULT: '#2196F3',
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        
        // Neutral Grays (Text, backgrounds, borders)
        gray: {
          DEFAULT: '#9E9E9E',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        
        // Food-specific colors
        food: {
          // Vegetables & Fresh
          fresh: '#8BC34A',
          veggie: '#4CAF50',
          salad: '#AED581',
          
          // Proteins
          meat: '#D32F2F',
          chicken: '#F57C00',
          fish: '#0288D1',
          
          // Carbs & Grains
          bread: '#D7CCC8',
          pasta: '#FFE082',
          rice: '#FFFDE7',
          
          // Dairy
          dairy: '#FFF9C4',
          cheese: '#FFD54F',
          
          // Sweets & Desserts
          dessert: '#F48FB1',
          chocolate: '#6D4C41',
          
          // Beverages
          coffee: '#5D4037',
          juice: '#FF6F00',
          soda: '#1976D2',
        },
        
        // Restaurant rating colors
        rating: {
          excellent: '#4CAF50',
          good: '#8BC34A',
          average: '#FFC107',
          poor: '#FF9800',
          bad: '#F44336',
        },
        
        // Delivery status colors
        delivery: {
          preparing: '#FF9800',
          onway: '#2196F3',
          delivered: '#4CAF50',
          cancelled: '#F44336',
          pending: '#FFC107',
        },
        
        // Background variations
        background: {
          DEFAULT: '#FFFFFF',
          paper: '#FAFAFA',
          light: '#F5F5F5',
          dark: '#121212',
          overlay: 'rgba(0, 0, 0, 0.5)',
        },
        
        // Text colors
        text: {
          primary: '#212121',
          secondary: '#757575',
          disabled: '#BDBDBD',
          hint: '#9E9E9E',
          inverse: '#FFFFFF',
        },
        
        // Border colors
        border: {
          DEFAULT: '#E0E0E0',
          light: '#EEEEEE',
          focus: '#00BCD4',
        },
        
        // Shadow colors
        shadow: {
          light: 'rgba(0, 0, 0, 0.05)',
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          medium: 'rgba(0, 0, 0, 0.15)',
          dark: 'rgba(0, 0, 0, 0.25)',
        },

        // Banner colors
        banner: {
          'dot-active': '#FFFFFF',
          'dot-inactive': 'rgba(255,255,255,0.5)',
          'overlay': 'rgba(0,0,0,0.30)',
        },
      },
      
      // Custom spacing for consistent UI
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      
      // Border radius for consistent rounded corners
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      
      // Font sizes
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      
      // Box shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },

      spacing: {
        gutter: '16px',
      },
    },
  },
  plugins: [],
}

