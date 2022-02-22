import { Client, Intents, MessageEmbed } from 'discord.js';
import axios from 'axios';
import chalk from 'chalk';
import pokemon from 'pokemon';
import 'dotenv/config';

const pokedex = pokemon.all();
const POKETWO = '716390085896962058';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once('ready', () => {
	console.log(chalk.black.bgYellow.bold(' UXIE ') + ' Ready!');
	client.user.setPresence({
		activities: [
			{
				type: 'WATCHING',
				name: 'for p!hint.',
			},
		],
		status: 'idle',
	});
});

client.on('messageCreate', async (message) => {
	if (message.member.id != POKETWO) return;

	if (message.content.startsWith('The pokémon is')) {
		const splits = message.content.split(' ');
		const lookup = splits
			.slice(3)
			.join(' ')
			.replace(/\.$/, '')
			.replaceAll(/\\\_/g, '.');
		const pattern = new RegExp(`^${lookup}$`, 'g');
		const results = pokedex.filter((str) => {
			return pattern.test(str);
		});

		console.log(
			`${chalk.black.bgYellow.bold(' UXIE ')}${chalk.black.bgCyan.bold(
				' MATCHES '
			)} Showing matches for ${lookup}: ${results}`
		);

		const embed = new MessageEmbed()
			.setColor('#efd68b')
			.setAuthor({ name: 'Uxie says', iconURL: client.user.avatarURL() });

		if (results.length > 0) {
			const name = results[0].replaceAll(/\s/g, '-').toLowerCase();
			try {
				const response = await axios.get(
					`https://pokeapi.co/api/v2/pokemon/${name}`
				);
				const sprite =
					response.data.sprites.other['official-artwork'][
						'front_default'
					];
				embed.setThumbnail(sprite);
			} finally {
				embed.setDescription(results.join('\n'));
			}
		} else embed.setDescription('No results found.');

		message.channel.send({ embeds: [embed] });
	}
});

client.login(process.env.TOKEN);
