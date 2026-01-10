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
    question: "Venezuela's inflation rate in 2018 reached an estimated _____%.",
    answer: "130,060",
    explanation: "Venezuela experienced one of the worst hyperinflations in modern history."
  },
  {
    id: 4,
    question: "The _____ production function, commonly used in growth models like Solow-Swan, takes the form Y = A K^α L^(1-α), where α represents the capital share of income.", 
    answer: "Cobb-Douglas", 
    explanation: "Named after Charles Cobb and Paul Douglas, this functional form exhibits constant returns to scale and diminishing marginal returns, making it a standard tool in empirical macroeconomics and growth theory." 
  },
  {
    id: 5,
    question: "In 1980, Fed Chairman _____ raised interest rates to 20% to fight inflation.",
    answer: "Paul Volcker",
    explanation: "Fed Chairman Paul Volcker raised rates to nearly 20% to break the back of double-digit inflation."
  },
  {
    id: 6,
    question: "China's economy grew by an average of _____% per year from 1978 to 2018.",
    answer: "9.5",
    explanation: "China achieved the most rapid sustained expansion by a major economy in history."
  },
  {
    id: 7,
    question: "The 1929 stock market crash saw the _____ stock index to lose 89% of its value by 1932.",
    answer: "Dow Jones",
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
    question: "The _____ craze of the 1990s saw some collectors paying over $5,000 for a single stuffed animal.",
    answer: "Beanie Baby",
    explanation: "At the height of Beanie Baby mania, rare specimens like 'Princess the Bear' sold for thousands. People treated them as serious investments, storing them in climate-controlled rooms."
  },
  {
    id: 16,
    question: "During the 17th century, the _____ Company was the first company to issue stocks to the public.",
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
    question: "The country that saw the first recorded stock market crash in 1637 was _____?",
    answer: "the Netherlands",
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
    question: "In 2010, a programmer famously bought two pizzas for 10,000 _____, now worth over $600 million.",
    answer: "Bitcoin",
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
  },
  { 
    id: 29,
    question: "In the Ramsey-Cass-Koopmans model, households optimize lifetime utility by choosing consumption and saving paths, leading to a steady-state growth rate determined by the rate of _____ progress.", 
    answer: "technological", 
    explanation: "This optimal growth model incorporates forward-looking consumers and a social planner, showing that the economy converges to a balanced growth path where consumption and capital grow at the exogenous rate of technological progress." 
  },
  { 
    id: 30,
    question: "The _____ model, also known as the aggregate demand-aggregate supply model, is widely used to explain fluctuations in output and price levels, including short-run effects of demand shocks and long-run neutrality of money.", 
    answer: "AD-AS", 
    explanation: "The AD-AS model depicts how shifts in aggregate demand or supply affect real GDP and the price level, with the vertical long-run aggregate supply curve reflecting classical assumptions of full employment and flexible prices." 
  },
  { 
    id: 31,
    question: "The IS-LM model, developed by John Hicks in 1937, illustrates the short-run equilibrium between _____ by combining the investment-saving (IS) curve with the liquidity preference-money supply (LM) curve.", 
    answer: "interest rates and output", 
    explanation: "The IS-LM model is a foundational Keynesian framework used to analyze the interaction between the goods market and money market, helping explain how fiscal and monetary policy affect interest rates and aggregate output in a closed economy." 
  },
  { 
    id: 32,
    question: "A business should shut down in the short run if the price it receives is less than its _____, because it cannot even cover its variable costs.", 
    answer: "average variable cost", 
    explanation: "In microeconomic reasoning, the shutdown rule states that if price < AVC, losses are minimized by producing nothing rather than continuing to incur avoidable variable costs." 
  },
  { 
    id: 33,
    question: "Rational consumers _____ subject to the constraint of their income and the prices they face, leading them to equate the marginal utility per dollar across all goods.", 
    answer: "maximimize their utility", 
    explanation: "The utility-maximization rule (MUx/Px = MUy/Py = …) is the core of consumer choice theory and explains how people allocate limited budgets among competing wants." 
  },
  { 
    id: 34,
    question: "The infamous 'Mississippi Bubble' of 1719 was masterminded by Scottish con-man John Law, who convinced the French government that printing endless money backed by _____ in Louisiana would make everyone rich.", 
    answer: "swamp land", 
    explanation: "Law sold the French aristocracy on the idea that mosquito-infested, alligator-filled bayous were the next gold rush. The bubble popped so hard it helped cause the French Revolution." 
  },
  { 
    id: 35,
    question: "In 1980s Britain, the 'Big Bang' financial deregulation led to so much cocaine-fueled trading that dealers started accepting _____ as payment from stressed-out yuppies on the trading floor.", 
    answer: "share certificates", 
    explanation: "For a brief period in the late 80s, powdered Peruvian marching powder was like a secondary currency in the City of London. Peak Thatcher-era degeneracy." 
  },
  { 
    id: 36,
    question: "The 1997 Asian Financial Crisis was partially triggered when Thai Prime Minister Chavalit Yongchaiyudh appeared on TV looking _____ while denying the baht would be devalued—causing everyone to panic-sell immediately.", 
    answer: "sweaty and nervous", 
    explanation: "The 'sweaty PM' moment is now studied in behavioral finance. Body language moved more money than the IMF that week." 
  },
  { 
    id: 37,
    question: "In 2008-2009 Iceland, after the banking collapse, citizens jokingly started a campaign to make their new prime minister the world's first '_____ of the nation' because she was the only politician who hadn't screwed them.", 
    answer: "lesbian", 
    explanation: "Jóhanna Sigurðardóttir became the world's first openly lesbian head of government. Icelanders' dark humor during bankruptcy was world-class." 
  },
  { 
    id: 38,
    question: "Since the 1900, ____ freed up 4-6 hours weekly per household, boosting women's workforce participation by 50%.", 
    answer: "washing machines", 
    explanation: "For high demand services in such as cleaning laundry, technological innovations allowed for vastly lower labor input costs."
  },
  { 
    id: 39,
    question: "The very first known 'minimum wage law' in history appears in the _____ Code (c. 1750 BCE), which set fixed daily wages in barley for different professions, including surgeons and ox drivers.", 
    answer: "Hammurabi's", 
    explanation: "If a builder's house collapsed and killed the owner, the builder was put to death. But if it only killed the owner's son? The builder's son got executed." 
  },
  { 
    id: 40,
    question: "The earliest known use of the word 'debt' in any language appears in Sumerian texts as _____.", 
    answer: "mas", 
    explanation: "'Mas', translated as 'neck-stock', was used because defaulting debtors could be literally collared like animals. If you couldn't pay, they put a wooden neck-stock on you until someone else bought your labor. Ancient creditors did not mess around." 
  },
  { 
    id: 41,
    question: "The first known use of 'futures contracts' appears in ancient Mesopotamia, where merchants agreed to deliver _____ at a fixed price after the harvest, hedging against price drops.", 
    answer: "dates", 
    explanation: "Date futures were the original commodity derivatives. Ancient risk management tasted very sweet." 
  },
  { 
    id: 42,
    question: "The Roman Republic's first known financial crisis (c. 352 BCE) was solved by creating a public debt registry and allowing debtors to pay off loans by surrendering _____ instead of land.", 
    answer: "their freedom", 
    explanation: "Debt bondage was so common they basically legalized voluntary temporary slavery as a repayment option. Ancient debt-relief had strings attached." 
  },
  {
    id: 43,
    question: "Robert Fogel's study estimated that the total social saving from U.S. _____ in 1890 was about 2.7% of GNP.",
    answer: "railroads",
    explanation: "Fogel's counterfactual analysis showed that while railroads were important, their overall contribution to economic growth was less than previously thought, as other transportation modes could have filled much of the gap."
  }
];

module.exports = questions;
