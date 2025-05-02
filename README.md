# Montessori Find

A comprehensive web application to help parents find Montessori schools across the United States.

## Features

- Browse schools by state and city
- View detailed school information
- Interactive Google Maps integration
- School reviews and ratings
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm 10.3.0 or later

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/montessori-find-v2.git
   cd montessori-find-v2
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables by creating a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

### External API Keys

This project uses the following external APIs:

- **Google Maps API**: For displaying school locations on maps
  - See [Google Maps Setup Guide](./docs/GOOGLE_MAPS_SETUP.md) for detailed instructions
- **Supabase**: For database and authentication

## Deployment

This project is deployed on Netlify. To deploy your own instance:

1. Connect your GitHub repository to Netlify
2. Set up the required environment variables in the Netlify dashboard
3. Configure build settings:
   - Build command: `pnpm run build`
   - Publish directory: `.next`

For detailed deployment instructions, refer to the [Netlify documentation](https://docs.netlify.com/configure-builds/overview/).

## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: Reusable React components
- `/lib`: Utility functions and API clients
- `/public`: Static assets
- `/styles`: Global CSS styles
- `/docs`: Project documentation

## Troubleshooting

- **Google Maps not displaying**: Ensure your Google Maps API key is properly set up in environment variables. See [Google Maps Setup Guide](./docs/GOOGLE_MAPS_SETUP.md).
- **CSS not loading**: If CSS is not loading on the deployed site, check that the build process is correctly including CSS files. This can be fixed by adding proper CSS handling in the build configuration.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 