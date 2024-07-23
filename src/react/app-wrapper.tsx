import React, { type ReactNode } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(
	import.meta.env.PUBLIC_CONVEX_URL as string,
);

export const AppWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<React.StrictMode>
			<ClerkProvider
				publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
			>
				<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
					{children}
				</ConvexProviderWithClerk>
			</ClerkProvider>
		</React.StrictMode>
	);
};
