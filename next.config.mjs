/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: "https",
			hostname: "cabinet-michou.com",
			
		  },
		],
	  },
	
};

export default nextConfig;
