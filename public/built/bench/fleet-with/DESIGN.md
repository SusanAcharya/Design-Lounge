# Van desk

## Brief

Request, word for word:
"Build a dashboard for a small courier company to watch its 12 delivery vans today: where they are, what's late, and who needs help."

Product: a dispatch dashboard for a small courier company with 12 delivery vans, for today only.
For: the dispatcher at the depot. In ten seconds: who needs help, which vans are late, where every van is.
World: depot yard, van plates, the run sheet.
The one thing: a map of the town where each van is its own number plate, beside a strip of 12 plates that says the whole day in one line.
Ambition: finished, because "a dashboard for a small courier company to watch its 12 delivery vans"
Mode: Kit
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: company name, driver names, real routes and stop counts, the GPS feed. The page runs on a labelled sample day until a feed is connected.

## Sheet

Direction: yard (the only direction that fits)
Theme: cinder (light) with night-shift (dark) · Pairing: industrial-label · Family: industrial (2px, no shadow, dense)
Hero: kanban-board, as the four status columns of the run board
Shell: collapsing-sidebar-rail
Map: store-locator-map (pins and rows are one selection)
Idea: the first screen is 12 van plates in a row, the ones that need help already orange, and the town map with the same plates where the vans are.
Signature: vans drawn as number plates, on the strip, the map and the board.
Avoiding: four equal KPI tiles; pins.

Default set aside: the kanban brief drags cards between columns. A van's column is computed from its run, so the board does not drag. The dispatcher moves a van out of Needs help with "Mark sorted".
