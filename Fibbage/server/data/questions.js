// Economics trivia questions database
const questions = [
  {
    id: 1,
    question: "In 1923, German hyperinflation got so bad that a loaf of bread cost _____ marks.",
    answer: "200 billion",
    explanation: "At the peak of Weimar hyperinflation in November 1923, prices doubled every 3.7 days."
  },
  {
    id: 2,
    question: "The Dutch 'Tulip Mania' bubble of 1637 saw a single tulip bulb sell for the price of _____.",
    answer: "a mansion in Amsterdam",
    explanation: "At the height of Tulip Mania, some rare bulbs sold for more than 10 times the annual income of a skilled craftsman."
  },
  {
    id: 3,
    question: "Venezuela's inflation rate in 2018 reached an estimated _____ percent.",
    answer: "130,060",
    explanation: "Venezuela experienced one of the worst hyperinflations in modern history."
  },
  {
    id: 4,
    question: "The 2008 financial crisis caused the U.S. to lose approximately _____ in household wealth.",
    answer: "$16 trillion",
    explanation: "Between 2007 and 2009, American households lost approximately $16 trillion in net worth."
  },
  {
    id: 5,
    question: "In 1980, the Federal Reserve raised interest rates to _____ percent to fight inflation.",
    answer: "20",
    explanation: "Fed Chairman Paul Volcker raised rates to nearly 20% to break the back of double-digit inflation."
  },
  {
    id: 6,
    question: "China's economy grew by an average of _____ percent per year from 1978 to 2018.",
    answer: "9.5",
    explanation: "China achieved the most rapid sustained expansion by a major economy in history."
  },
  {
    id: 7,
    question: "The 1929 stock market crash saw the Dow Jones lose _____ percent of its value by 1932.",
    answer: "89",
    explanation: "The Dow peaked at 381.17 in 1929 and bottomed at 41.22 in 1932."
  },
  {
    id: 8,
    question: "Bitcoin's price went from $1,000 in January 2017 to nearly _____ by December 2017.",
    answer: "$20,000",
    explanation: "Bitcoin experienced one of the most dramatic bubbles in financial history."
  },
  {
    id: 9,
    question: "In 1720, Isaac Newton famously lost £20,000 from a failed investment in the ____ Company.",
    answer: "South Sea",
    explanation: "Largely due to market speculation and false marketing of accessible trade in the South Seas, the South Sea Bubble burst leading to a national recession in Britain."
  },
	{
		id: 10,
		question: "A tariff that is charged as a fixed percentage of the value of an imported good is known as an ____ tariff.",
		answer: "ad valorem",
		explanation: "An ad valorem tariff is calculated as a constant percentage of the good's customs value, rather than as a fixed amount per unit."
	},
	{
		id: 11,
		question: "The U.S. Tariff Act of 1930, which sharply raised duties on more than 20,000 imported products during the Great Depression, is commonly known as the Smoot-____ Tariff.",
		answer: "Hawley",
		explanation: "The Smoot-Hawley Tariff Act of 1930 significantly increased U.S. tariffs, provoking foreign retaliation and contributing to a collapse in world trade."
	},
	{
		id: 12,
		question: "In early 19th-century U.S. history, high tariffs that protected “infant industries” from British competition were a key feature of the economic system as highly popularized by ____.",
		answer: "Alexander Hamilton",
		explanation: "Alexander Hamilton advocated for protective tariffs with the goal of nurturing young American industries, an approach highly employed in early U.S. tariff policy."
	},
	{
		id: 13,
		question: "In international trade, a policy that deliberately harms another country's economic welfare—for example, by imposing a welfare-maximizing tariff at that country's expense—is often described as a “beggar-thy-____” policy",
		answer: "neighbor",
		explanation: "When a country sets an optimal tariff that improves its own welfare while worsening that of its trading partner, the policy is described as beggar-thy-neighbor."
	},
	{
		id: 14,
		question: "The nineteenth-century British tariff system that imposed duties on imported grain to keep domestic prices high, and whose repeal in 1846 marked a major shift toward free trade, was known as the ____ Laws.",
		answer: "Corn",
		explanation: "Britain's Corn Laws levied tariffs on imported grain to protect domestic landowners, but their 1846 repeal signaled a move toward liberal trade policy."
	},
  {
    id: 15,
    question: "The Beanie Baby craze of the 1990s saw some collectors paying over $_____ for a single stuffed animal.",
    answer: "5,000",
    explanation: "At the height of Beanie Baby mania, rare specimens like 'Princess the Bear' sold for thousands. People treated them as serious investments, storing them in climate-controlled rooms."
  },
  {
    id: 16,
    question: "During the 17th century, the ____ Company was the first company to issue stocks to the public.",
    answer: "Dutch East India",
    explanation: "The Dutch East India Company pioneered the concept of publicly traded shares, allowing investors to buy ownership stakes."
  },
  {
    id: 17,
    question: "In 1976, Gary Dahl became a millionaire by selling _____ as pets for $3.95 each.",
    answer: "rocks",
    explanation: "The Pet Rock craze lasted six months but made Dahl a millionaire. Each rock came in a cardboard box with breathing holes and an instruction manual for 'training' your pet rock."
  },
  {
    id: 18,
    question: "The first paper money was introduced in China during the _____ Dynasty.",
    answer: "Tang",
    explanation: "The Tang Dynasty (618-907 AD) saw the first use of paper money, which helped facilitate trade across the vast empire."
  },
  {
    id: 19,
    question: "In 2021, a digital artwork by Beeple sold as an NFT for $_____ million.",
    answer: "69",
    explanation: "The NFT (non-fungible token) craze reached new heights when Beeple's digital collage 'Everydays: The First 5000 Days' sold for $69 million at Christie's auction house."
  },
  {
    id: 20,
    question: "The concept of 'opportunity cost' in economics was popularized by French economist ____.",
    answer: "Frédéric Bastiat",
    explanation: "Frédéric Bastiat, a 19th-century French economist, is credited with popularizing the concept of opportunity cost, emphasizing the value of foregone alternatives in decision-making."
  },
  {
    id: 21,
    question: "In 1636, a Dutch sailor mistook a valuable tulip bulb for an _____ and ate it.",
    answer: "onion",
    explanation: "Tulip bulbs were so valuable during the Tulip Mania the sailor's expensive snack cost his employer the price of an entire ship. He was thrown in jail and was reported to have bad breath."
  },
  {
    id: 22,
    question: "The first recorded stock market crash occurred in 1637 in which country?",
    answer: "Netherlands",
    explanation: "The Dutch Tulip Mania bubble burst in 1637, leading to the first recorded stock market crash in history."
  },
  {
    id: 23,
    question: "In feudal Japan, samurai were officially paid in _____, measured in units called 'koku.'",
    answer: "rice",
    explanation: "A samurai's wealth and rank were measured in koku (enough rice to feed one person for a year). High-ranking samurai received thousands of koku annually."
  },
  {
    id: 24,
    question: "The 'Dutch Disease' refers to the negative economic impact that can occur when a country discovers a large amount of _____.",
    answer: "natural resources",
    explanation: "The term 'Dutch Disease' originated from the Netherlands' experience after discovering large natural gas reserves, which led to currency appreciation and harm to other export sectors."
  },
  {
    id: 25,
    question: "In 2010, a programmer famously bought two pizzas for _____ Bitcoin, now worth over $600 million.",
    answer: "10,000",
    explanation: "On May 22, 2010, Laszlo Hanyecz made the first real-world transaction using Bitcoin by purchasing two pizzas for 10,000 BTC, which would be worth hundreds of millions today."
  },
  {
    id: 26,
    question: "Economist Milton Freidman famously quoted: 'There is no such thing as _____'.",
		answer: "a free lunch",
		explanation: "He used it to argue that government spending always has costs - even 'free' programs are paid for through taxes, debt, or inflation."
  },
  {
    id: 27,
    question: "When Ireland was having its bank strikes in the early 70s, people used ____ as a replacement currency.",
		answer: "napkins",
		explanation: "To deal with not being able to withdraw their money from banks, people just wrote IOUs to each other in napkins. Ireland's national GDP even increased during the period of the bank strike."
  },
  {
    id: 28,
    question: "In the 21st century after the natural disaster known as _____, insurance companies paid out approximately $41 billion in claims, the costliest natural disaster in U.S. history.",
		answer: "Hurricane Katrina",
		explanation: "Katrina's insurance payouts bankrupted several insurers and caused many to stop offering coverage in coastal areas. The disaster fundamentally changed how insurance companies assess climate risk and price policies."
  }
];

module.exports = questions;
