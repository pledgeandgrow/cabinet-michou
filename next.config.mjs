/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: "https",
			hostname: "cabinet-michou.com",
			
		  },
		  {
			protocol: "https",
            hostname: "images.pexels.com",
		  }
		],
	  },

	typescript:{
		ignoreBuildErrors:true
	},
	output:'standalone'
	  
	
};

export default nextConfig;
