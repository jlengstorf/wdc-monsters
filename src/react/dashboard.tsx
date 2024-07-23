import { useEffect, useState } from 'react';
import { Authenticated, useMutation, useQuery } from 'convex/react';
import { Image } from '@unpic/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { scale, thumbnail } from '@cloudinary/url-gen/actions/resize';
import { api } from '../../convex/_generated/api';
import { AppWrapper } from './app-wrapper';
import type { Doc } from '../../convex/_generated/dataModel';

import '../styles/dashboard.css';

const cloudinary = new Cloudinary({
	cloud: {
		cloudName: 'jlengstorf',
	},
});

const DisguiseChooser = () => {
	const [selectedMonster, setSelectedMonster] = useState<Doc<'monsters'>>();
	const [selectedDisguise, setSelectedDisguise] =
		useState<Doc<'disguiseChoices'>>();
	const [hasSaved, setHasSaved] = useState(false);
	const [monsterImageUrl, setMonsterImageUrl] = useState<string>();
	const [disguiseImageUrl, setDisguiseImageUrl] = useState<string>();
	const monsters = useQuery(api.monsters.get);
	const choices = useQuery(api.disguises.getChoices);
	const saveDisguise = useMutation(api.disguises.saveDisguise);

	useEffect(() => {
		if (selectedMonster) {
			const currMonster = monsters?.find((m) => m._id === selectedMonster._id);
			const monsterImg = cloudinary
				.image(currMonster?.cloudinary_asset_id)
				.resize(scale().width(400))
				.toURL();

			setMonsterImageUrl(monsterImg);
		}
	}, [selectedMonster]);

	useEffect(() => {
		if (selectedDisguise) {
			const currChoice = choices?.find((c) => c._id === selectedDisguise._id);
			const choiceImg = cloudinary
				.image(currChoice?.cloudinary_asset_id)
				.resize(scale().width(400))
				.toURL();

			setDisguiseImageUrl(choiceImg);
		}
	}, [selectedDisguise]);

	async function save() {
		const overlay = `l_${selectedDisguise?.cloudinary_asset_id.replaceAll('/', ':')}/w_400/fl_layer_apply`;
		const url = `https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto,w_400/${overlay}/${selectedMonster?.cloudinary_asset_id}.jpg`;

		await saveDisguise({
			url,
		});

		setSelectedMonster(undefined);
		setSelectedDisguise(undefined);
		setHasSaved(true);
	}

	return (
		<>
			{hasSaved ? (
				<div className="saved">
					<p>
						Your disguise was saved!{' '}
						<a href="/">See all created disguises on the home page</a>.
					</p>
				</div>
			) : null}

			{!selectedMonster ? (
				<>
					<h2>Choose a Monster</h2>
					<div className="monster-chooser">
						{monsters?.map((monster) => {
							const img = cloudinary
								.image(monster.cloudinary_asset_id)
								.resize(thumbnail().width(200).height(200).gravity('auto'))
								.format('auto');

							return (
								<button
									className="monster-choice"
									key={monster._id}
									onClick={() => {
										setSelectedMonster(monster);
									}}
								>
									<Image
										src={img.toURL()}
										alt={monster.name}
										width={400}
										aspectRatio={1}
									/>
								</button>
							);
						})}
					</div>
				</>
			) : null}

			{selectedMonster ? (
				<>
					<h2>Choose a Disguise</h2>
					<div className="disguise-builder">
						{monsterImageUrl ? (
							<>
								{disguiseImageUrl ? (
									<>
										<div className="selected-disguise">
											<Image
												src={disguiseImageUrl}
												alt={selectedDisguise?.name}
												className="disguise-image"
												width={400}
												aspectRatio={1}
											/>
										</div>
									</>
								) : null}

								<div className="selected-monster">
									<Image
										src={monsterImageUrl}
										alt={selectedMonster?.name}
										className="monster-image"
										width={400}
										aspectRatio={1}
									/>
								</div>

								<div className="disguise-choices">
									{choices?.map((choice) => {
										const img = cloudinary
											.image(choice.cloudinary_asset_id)
											.resize(
												thumbnail().width(200).height(200).gravity('auto'),
											)
											.format('auto');

										return (
											<button
												className="disguise-choice"
												onClick={() => {
													setSelectedDisguise(choice);
												}}
											>
												<img src={img.toURL()} alt={choice.name} width={400} />
											</button>
										);
									})}
								</div>
							</>
						) : null}
					</div>
				</>
			) : null}

			{monsterImageUrl && disguiseImageUrl ? (
				<div className="save-button">
					<button onClick={() => save()}>SAVE</button>
				</div>
			) : null}
		</>
	);
};

export const Dashboard = () => {
	return (
		<AppWrapper>
			<Authenticated>
				<DisguiseChooser />
			</Authenticated>
		</AppWrapper>
	);
};
