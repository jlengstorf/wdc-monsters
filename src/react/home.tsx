import { Authenticated, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AppWrapper } from './app-wrapper';

import '../styles/dashboard.css';

const DisguiseList = () => {
	const disguises = useQuery(api.disguises.getAllDisguises);

	return (
		<>
			{disguises && disguises.length > 0 ? (
				<>
					<h2>Created Disguises</h2>
					<div className="disguises">
						{disguises?.map((disguise) => (
							<img
								key={disguise._id}
								src={disguise.url}
								alt="custom user disguise"
							/>
						))}
					</div>
				</>
			) : null}
		</>
	);
};

export const Home = () => {
	return (
		<AppWrapper>
			<Authenticated>
				<DisguiseList />
			</Authenticated>
		</AppWrapper>
	);
};
