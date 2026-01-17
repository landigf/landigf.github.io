// Exercise data extracted from CSV
const exercises = [
    {
        name: "The Sultan Trail",
        aka: "MAX # of overlapping intervals",
        week: "Week 01",
        methods: "Sweep Line",
        complexity: "O(n logn)",
        inputSize: "n ~ 10^6",
        description: "We have a vector of intervals [start,end] and want to find the max number of overlapping intervals (in a point). We add +1 at each start and remove -1 at each end, we take the maximum. Pay attention to counting the starting before closing.",
        solution: "Use sweep line algorithm: add +1 at each interval start and -1 at each end, sort events (prioritizing starts), then track maximum count",
        speciality: "Sweep Line"
    },
    {
        name: "Even Pairs",
        aka: "# of subarrays with even sum",
        week: "Week 01",
        methods: "Combinatorics, Prefix sum",
        complexity: "O(n)",
        description: "We have a vector of integers, we want to count the number of subarrays with even sum. So xi+…+xj = Even Integer. Use prefix sum: S_i = x0+..+xi. Notice that Sj - S_i-1 is even when both are even or both are odd. Count all combination of pairs of indexes where Si,Sj are both even or odd.",
        solution: "Use prefix sums and combinatorics: count pairs of indices where cumulative sums are both even or both odd using binomial coefficient n*(n-1)/2",
        speciality: "Prefix Sum with Combinatorics"
    },
    {
        name: "Dominoes",
        aka: "Dominoes",
        week: "Week 01",
        methods: "Greedy",
        complexity: "O(n)",
        description: "We have a vector of positive integers representing the height of dominoes. At each index we have a piece, then we need to see how far dominoes will continue falling starting from left. Think of each domino as a gas station. We start with fuel equal to the height of the first, then for each step we decrement the fuel. At each index if the fuel is ≤ 0 then we need to stop. Otherwise, we get the fuel as the max(current, gasStation).",
        solution: "Greedy approach: track remaining height as fuel, decrement at each step, stop when fuel ≤ 0, otherwise take max of current fuel and new domino height",
        speciality: "Greedy Simulation"
    },
    {
        name: "Search Snippets",
        aka: "find MINIMUM interval containing all categories at distinct indexes",
        week: "Week 02",
        methods: "Greedy, min-heap",
        complexity: "O(n logn)",
        description: "Find the minimum interval that contains all different categories at distinct positions.",
        solution: "Use greedy approach with min-heap to track minimum window containing all categories",
        speciality: "Sliding Window with Heap"
    },
    {
        name: "Severus Snape",
        aka: "min number of potions",
        week: "Week 02",
        methods: "Dynamic Programming, Greedy, Prefix sum",
        complexity: "O(n^2)",
        inputSize: "n ~ 100",
        description: "We need to get at least 3 values P, H, W. We reach these values by taking potions of two types. For one type we go greedy. For the other there is no greedy approach so DP needed (brute force is infeasible). USE LONG LONG.",
        solution: "Combine DP for one potion type with greedy for another, using prefix sums and binary search to minimize total potions needed",
        speciality: "Hybrid DP + Greedy"
    },
    {
        name: "San Francisco",
        aka: "max score traversing directed graph WITHIN k moves",
        week: "Week 02",
        methods: "Dynamic Programming",
        complexity: "O(n^2)",
        inputSize: "n ~ 10^3",
        description: "We have a directed graph, and the goal is to get the max score by traversing it in max K moves. We get score by traversing one edge (score += value of edge). Print 'Impossible' if cannot reach target.",
        solution: "Use DP with states dp[moves][node] to track maximum score reachable at each node within k moves",
        speciality: "Graph DP with Move Limit"
    },
    {
        name: "Greyjoy",
        aka: "find max length of consecutive nodes with sum = k in tree",
        week: "Week 02",
        methods: "Prefix sum, Two Sum",
        complexity: "O(n^2)",
        inputSize: "n ~ 10^4",
        description: "We have one root with only branches. GOAL: max length of consecutive nodes with sum of value of nodes equal to K. First solve for each branch with Two Sum or sliding window, then do Two Sum from different branches. Pay attention to change the target and remove root to avoid double counting.",
        solution: "Use prefix sums with Two Sum approach for each branch, then combine branches adjusting for root value to find maximum length",
        speciality: "Two Sum on Tree Paths"
    },
    {
        name: "Burning Coins",
        aka: "2-player, 2 possible move",
        week: "Week 02",
        methods: "2-player, Dynamic Programming",
        complexity: "O(n^2)",
        inputSize: "n ~ 10^3",
        description: "We have a vector of positive integers, it's a two player game where we can only make 2 actions: 1. take first element (left) 2. take last element (right). Each element has a value. The goal is to take the maximum value possible independently of opponent strategy.",
        solution: "Use game theory DP with memoization: recursively compute optimal moves assuming opponent plays optimally, tracking me(i,j) and opp(i,j) states",
        speciality: "Game Theory DP"
    },
    {
        name: "First steps with BGL",
        aka: "Dijkstra + MST",
        week: "Week 03",
        methods: "Dijkstra, Minimum Spanning Tree",
        complexity: "O(n logn)",
        inputSize: "n ~ 100",
        description: "Basic graph algorithms: Dijkstra's shortest path and Minimum Spanning Tree using Boost Graph Library.",
        solution: "Apply Dijkstra's algorithm for shortest paths and Kruskal's algorithm for MST using BGL",
        speciality: "Basic Graph Algorithms"
    },
    {
        name: "Important Bridges",
        aka: "biconnected components",
        week: "Week 03",
        methods: "Biconnected Graph",
        complexity: "O(n logn)",
        inputSize: "n ~ 10^4",
        description: "Find edges that when removed cause at least 2 nodes to be no longer connected. Biconnected components find articulation points: if removed they disconnect. But here we are interested in the edges, so an edge is critical if there is just one edge in a component.",
        solution: "Find biconnected components; an edge is critical (bridge) if it's the only edge in its component",
        speciality: "Bridge Finding"
    },
    {
        name: "Ant Challenge",
        aka: "multiple MST + Dijkstra",
        week: "Week 03",
        methods: "Dijkstra, Minimum Spanning Tree",
        complexity: "O(n logn)",
        inputSize: "n ~ 100",
        description: "Multiple MST for lowest edge cost + Dijkstra. Combine results from multiple MSTs to find optimal path.",
        solution: "Compute MST for each network to find minimum edge weights, combine into single graph, then run Dijkstra",
        speciality: "Multi-Network Graph"
    },
    {
        name: "Buddy Selection",
        aka: "maximum matching with only certain edges",
        week: "Week 03",
        methods: "Maximum matching",
        complexity: "O(n^2)",
        inputSize: "n ~ 100",
        description: "Best pairing but we need to check if we can do better than a certain condition: 'the poorest pair has k+1 common interests'. Delete all edges between people that have less than k+1 common interests and then do max matching.",
        solution: "Build graph with edges only between pairs with >k common interests, then check if maximum matching covers all vertices",
        speciality: "Constrained Matching"
    },
    {
        name: "Lord Voldemort",
        aka: "max length of non overlapping intervals",
        week: "Week 03",
        methods: "Dynamic Programming, Prefix sum",
        complexity: "O(n logn)",
        inputSize: "n ~ 10^6",
        description: "Find the maximum length of non-overlapping intervals.",
        solution: "Sort intervals and use DP or greedy approach to select maximum non-overlapping set",
        speciality: "Interval Scheduling"
    },
    {
        name: "Hit",
        aka: "Hit",
        week: "Week 04",
        methods: "Computational Geometry",
        description: "Computational geometry problem involving ray-segment intersection tests.",
        solution: "Use CGAL geometric predicates to test ray-segment intersections efficiently",
        speciality: "Ray Casting"
    },
    {
        name: "Moving Books",
        aka: "Check feasibility",
        week: "Week 05",
        methods: "Binary Search, Greedy",
        description: "Check if it's feasible to move all books given constraints. Use binary search on answer combined with greedy verification.",
        solution: "Binary search on number of trips, use greedy algorithm to verify if configuration is feasible",
        speciality: "Binary Search + Greedy"
    },
    {
        name: "Planet Express",
        aka: "Multi-source Dijkstra with teleportation",
        week: "Week 05",
        methods: "Dijkstra, Strongly Connected Components",
        complexity: "O(n logn)",
        inputSize: "n ~ 10^6",
        description: "Multi-source Dijkstra: add new source connecting to old sources with cost 0. Find shortest path from one of the sources to a target node + a network of teleportation. Print 'no' if impossible.",
        solution: "Group teleport nodes by strongly connected components, add virtual source to all starting nodes with cost 0, run Dijkstra",
        speciality: "Multi-source Shortest Path"
    },
    {
        name: "Knights",
        aka: "max flow with VERTEX CAPACITY",
        week: "Week 06",
        methods: "MaxFlow",
        description: "Maximum flow problem with vertex capacity constraints. Split vertices to handle capacity.",
        solution: "Split each vertex with capacity into two vertices connected by edge with that capacity, then run max flow",
        speciality: "Vertex Capacity Flow"
    },
    {
        name: "Tiles",
        aka: "maximum matching in undirected unweighted graph",
        week: "Week 06",
        methods: "Maximum matching",
        complexity: "O(n^2)",
        inputSize: "n ~ 100",
        description: "We have an undirected unweighted graph and we want to find if each vertex can be covered with maximum matching. Print 'yes'/'no'.",
        solution: "Use Edmonds' algorithm for maximum matching; check if matching size * 2 equals number of vertices",
        speciality: "Perfect Matching"
    },
    {
        name: "Coin Tossing Tournament",
        aka: "max flow game match",
        week: "Week 06",
        methods: "MaxFlow",
        description: "Max flow game match with 1 point if win and 0 if lose. We can use this solution only if whatever the result of a match the same amount of points will be distributed.",
        solution: "Model as max flow: matches as intermediate nodes, check if flow equals expected total points",
        speciality: "Tournament Verification"
    },
    {
        name: "Motorcycles",
        aka: "Non hitting positive plane rays",
        week: "Week 06",
        methods: "Smart",
        description: "Determine which motorcycle rays don't hit any other ray in positive plane.",
        solution: "Sort by slope and position, use sweep line to determine which rays are never blocked",
        speciality: "Geometric Sweep"
    },
    {
        name: "London",
        aka: "recreate word using pieces of journal",
        week: "Week 06",
        methods: "MaxFlow",
        description: "Recreate a word using pieces of journal with front and back constraints.",
        solution: "Model as max flow: character positions to paper pieces, considering front/back constraints",
        speciality: "String Matching Flow"
    },
    {
        name: "Bistro",
        aka: "Post office problem",
        week: "Week 07",
        methods: "Delaunay triangulation",
        complexity: "O(n logn)",
        inputSize: "n ~ 10^3",
        description: "Basically we have n 2D points, and we have some new m points (queries) where we want to find the closest point to it. Brute force: O(n) to look for the closest point → O(m*n). Solution: Delaunay triangulation, precompute the original points, then query in O(logn) → O(m*logn). Print squared euclidean distances.",
        solution: "Build Delaunay triangulation of points, then use nearest neighbor queries in O(log n) per query",
        speciality: "Nearest Neighbor Search"
    },
    {
        name: "Inball",
        aka: "Maximum ball in cave",
        week: "Week 04",
        methods: "Linear Programming",
        complexity: "O(d × n)",
        description: "You are given a 'cave' defined by a set of linear inequalities in d-dimensional space. The goal is to find the maximum integral radius r of a d-dimensional ball that fits inside this cave. The condition for a ball of center c and radius r to fit in a half-space a^T x ≤ b is modeled as the linear constraint a^T c + ||a||_2 r ≤ b.",
        solution: "Model as Linear Programming problem: maximize r subject to constraints a^T c + ||a||_2 r ≤ b for each half-space, solve using LP solver (e.g., CGAL)",
        speciality: "LP Optimization"
    },
    {
        name: "London",
        aka: "Ransom note from newspaper",
        week: "Week 06",
        methods: "MaxFlow",
        complexity: "O(n^3)",
        description: "You are given a ransom note and a set of newspaper pieces. Each piece has a letter on the front and a different letter on the back. You must determine if it is possible to construct the note by cutting out pieces and choosing which side to face up.",
        solution: "Model as Max Flow problem: construct flow network where source connects to letter pair nodes (newspaper pieces), which connect to required letter nodes (note positions). Max flow equals note length means success.",
        speciality: "Bipartite Matching Flow"
    },
    {
        name: "Clues",
        aka: "Radio station coloring",
        week: "Week 04",
        methods: "Delaunay triangulation, DFS",
        complexity: "O(n log n)",
        description: "Given a set of radio stations (points) with range r, determine if the network can be 2-colored (no two interfering stations share a color) and if two specific clients can communicate. Stations interfere if distance < r.",
        solution: "Use Delaunay Triangulation to efficiently construct the network (contains EMST for connectivity). Perform DFS to assign colors and verify no edges shorter than r connect same-colored nodes (bipartite check).",
        speciality: "Graph 2-Coloring with Geometry"
    },
    {
        name: "Knights",
        aka: "Knights in hallway",
        week: "Week 06",
        methods: "MaxFlow",
        complexity: "O(V^2 × E)",
        description: "Find the maximum number of knights that can traverse a grid hallway from given starting points to an 'outside' boundary without colliding. Vertex capacities are limited (e.g., intersection capacity C).",
        solution: "Model as Max Flow with vertex capacities: split each intersection vertex v into v_in and v_out connected by edge with capacity C. Connect starting positions to source and boundary nodes to sink.",
        speciality: "Vertex Capacity Flow"
    },
    {
        name: "Kingdom Defense",
        aka: "Circulation with demands",
        week: "Week 06",
        methods: "MaxFlow",
        complexity: "O(V × E^2)",
        description: "Assign soldier movements in a network of cities and paths to satisfy vertex demands/supplies and edge capacities (both minimum and maximum flow limits). Each city has supply/demand, each path has min/max capacity.",
        solution: "Transform to Max Flow: adjust edge capacities to (max - min), add source/sink edges to force minimum flow into/out of nodes, check if max flow saturates necessary edges.",
        speciality: "Circulation Problem"
    },
    {
        name: "First Hit",
        aka: "Ray segment intersection",
        week: "Week 04",
        methods: "Computational Geometry",
        complexity: "O(n) expected, O(n^2) worst",
        description: "Given a ray r and a set of n segments, find the first point where the ray intersects a segment. Need to minimize expensive geometric constructions.",
        solution: "Use randomized geometric algorithm: shuffle segments and iterate. Maintain closest intersection point and 'clip' ray to this point. Expected O(log n) geometric constructions.",
        speciality: "Randomized Geometry"
    },
    {
        name: "Buddy Selection",
        aka: "Perfect matching with interests",
        week: "Week 03",
        methods: "Maximum matching",
        complexity: "O(n^3)",
        inputSize: "n ~ 100",
        description: "Given a list of students and their interests, determine if it is possible to pair everyone up (perfect matching) such that every pair shares strictly more than f interests.",
        solution: "Construct graph by comparing sorted interest lists for every pair (linear scan). Use Edmonds' maximum cardinality matching to find optimal pairing. Check if matching size × 2 equals number of students.",
        speciality: "Perfect Matching Verification"
    },
    {
        name: "Germs",
        aka: "Growing circles",
        week: "Week 04",
        methods: "Delaunay triangulation",
        complexity: "O(n log n)",
        description: "Circular germs grow quadratically (r(t) = t^2 + 0.5). A germ dies when it touches another germ or the container boundary. Determine the time of the first death, median death, and last death.",
        solution: "Death time is determined by distance to nearest neighbor (or boundary). Construct Delaunay Triangulation to find nearest neighbor for every germ in O(n log n). Extract death times and sort for statistics.",
        speciality: "Nearest Neighbor with Delaunay"
    },
    {
        name: "Hiking Maps",
        aka: "Minimum covering triangles",
        week: "Week 04",
        methods: "Sliding Window, Computational Geometry",
        complexity: "O(n × m)",
        description: "You are given a hiking path (sequence of segments) and a set of map triangles. Find the minimum length subsequence of triangles that fully covers the path.",
        solution: "Use sliding window (two-pointers): expand window (add triangles) until all path segments are covered, then shrink from start to minimize length. Use geometric predicates (orientation tests) for containment checks.",
        speciality: "Geometric Sliding Window"
    },
    {
        name: "Moving Books",
        aka: "Minimize rounds",
        week: "Week 05",
        methods: "Binary Search, Greedy",
        complexity: "O(N log N)",
        description: "A set of people with strength s_i must move a set of boxes with weight w_j. Find the minimum number of rounds required to move all boxes. Each person can carry at most one box per round, and only if their strength ≥ box weight.",
        solution: "Use greedy strategy: in each round, strongest available people should carry heaviest boxes they can lift. Efficiently implement using std::multiset to store and retrieve box weights in O(N log N) time.",
        speciality: "Greedy with Multiset"
    }
];
