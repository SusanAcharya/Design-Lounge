# Van desk

## Brief

Request, word for word:
"Build a dashboard for a small courier company to watch its 12 delivery vans today: where they are, what's late, and who needs help."

Product: a dispatch screen for a small courier company with 12 delivery vans, for today only.
For: the dispatcher at the depot desk. In ten seconds: who needs a person now, what is running late, where each van is.
World: depot yard, hi-vis, the dispatch radio.
The one thing: a board of the 12 vans sorted by who needs a person, with a drawn town map beside it where every van sits.
Ambition: finished, because "a dashboard ... to watch its 12 delivery vans today"
Mode: Kit
Named aesthetic: none
Stack: plain index.html + styles.css + main.js that works when opened directly
Missing: company name, town and street names, driver names, real stop counts and addresses, phone numbers, the GPS feed. The page runs on a sample day (marked as sample in the footer) until a dispatch feed is wired in.

## Sheet

Direction: yard (the only direction that fits)
Theme: cinder (light) with night-shift (dark) · https://www.designlounge.live/themes/cinder
Pairing: industrial-label · https://www.designlounge.live/type/industrial-label
Family: industrial · radius 2px, solid buttons, dense, no shadow
Hero: kanban-board (as a status board, not dragged; stacks on phone) · https://www.designlounge.live/demo/kanban-board
Pieces: collapsing-sidebar-rail, status-badge, store-locator-map (synced map and list), load-failed-retry, list-empty-plain, saved-banner

Idea: The first thing on screen is the column of vans that need a person, each with the one call that fixes it. The other nine vans sit quiet in grey, and the map beside them shows where all twelve are.
Signature: the slip strip. Every van carries a bar of its stops for the day, filled to the stops done, with an ink tick where the schedule says it should be now. The gap between them, in orange or amber, is how far behind it is.
Avoiding: four equal KPI tiles, and a map above the queue on a phone.
Tabs: Board, Map, Settings (one rail).

Default set aside: none.
