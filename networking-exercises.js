// Interactive exercise system - W3Schools style
const EXERCISES = [
  // Linux Basics Pack
  {
    id: "linux-ip-show",
    category: "Linux Basics",
    title: "Show network interfaces and IPs",
    desc: "Goal: Display all network interfaces with their IP addresses.",
    prompt: "Type the command to show IP addresses for all interfaces.",
    accepted: [
      /^ip\s+a$/,
      /^ip\s+addr$/,
      /^ip\s+address$/,
      /^ip\s+addr\s+show$/
    ],
    hint: "The modern tool is iproute2. Use 'a' as shorthand for 'address'.",
    solution: "ip a",
    explain: "This shows Layer 3 (IP) config. Look for 'inet' (IPv4) and 'inet6' (IPv6) lines."
  },
  {
    id: "arp-view",
    category: "ARP",
    title: "View ARP cache",
    desc: "Goal: Check which IP-to-MAC mappings your system knows.",
    prompt: "Type the command to view the ARP cache (Linux).",
    accepted: [
      /^ip\s+neigh$/,
      /^ip\s+neigh\s+show$/,
      /^ip\s+neighbor$/,
      /^ip\s+neighbor\s+show$/,
      /^arp\s+-a$/
    ],
    hint: "The modern Linux tool is 'ip neigh'. On macOS/older systems, use 'arp -a'.",
    solution: "ip neigh show",
    explain: "Shows current ARP entries. 'REACHABLE' means recently verified, 'STALE' means old entry."
  },
  {
    id: "dns-dig-basic",
    category: "DNS",
    title: "Perform basic DNS lookup",
    desc: "Goal: Query DNS for A record of a domain.",
    prompt: "Type the command to query the A record for example.com.",
    accepted: [
      /^dig\s+example\.com$/,
      /^dig\s+example\.com\s+A$/,
      /^dig\s+A\s+example\.com$/
    ],
    hint: "Use 'dig' followed by the domain name. A records are queried by default.",
    solution: "dig example.com",
    explain: "dig queries DNS. Look for the ANSWER SECTION showing the IP address."
  },
  {
    id: "dhcp-view-lease",
    category: "DHCP",
    title: "View DHCP lease information",
    desc: "Goal: Check what IP address and configuration DHCP assigned.",
    prompt: "Type the command to view DHCP lease on macOS interface en0.",
    accepted: [
      /^ipconfig\s+getpacket\s+en0$/,
      /^sudo\s+ipconfig\s+getpacket\s+en0$/
    ],
    hint: "On macOS, use 'ipconfig getpacket' followed by interface name.",
    solution: "ipconfig getpacket en0",
    explain: "Shows DHCP server IP, assigned IP, subnet mask, router (gateway), DNS servers, and lease time."
  },
  {
    id: "subnet-calculate",
    category: "Subnetting",
    title: "Calculate usable hosts",
    desc: "Mental exercise: How many usable hosts in a /26 network?",
    prompt: "Type just the number (e.g., 254).",
    accepted: [
      /^62$/
    ],
    hint: "/26 means 6 bits for hosts. 2^6 = 64, minus 2 (network & broadcast) = 62.",
    solution: "62",
    explain: "/26 = 32-26 = 6 host bits. 2^6 = 64 addresses total. Usable = 64 - 2 = 62."
  },
  {
    id: "tcp-connections",
    category: "TCP",
    title: "Show TCP connections",
    desc: "Goal: List all established TCP connections.",
    prompt: "Type the command to show established TCP connections with numeric addresses.",
    accepted: [
      /^ss\s+-tn$/,
      /^ss\s+-nt$/,
      /^netstat\s+-tn$/,
      /^netstat\s+-nt$/
    ],
    hint: "Use 'ss' (modern) or 'netstat' with -t (TCP) and -n (numeric) flags.",
    solution: "ss -tn",
    explain: "Shows active TCP connections. Look for state ESTAB (established)."
  },
  {
    id: "linux-ip-route",
    category: "Linux Basics",
    title: "Show the routing table",
    desc: "Goal: Display routes to identify the default gateway.",
    prompt: "Type the command to show the routing table (Linux).",
    accepted: [
      /^ip\s+r$/,
      /^ip\s+route$/,
      /^ip\s+route\s+show$/
    ],
    hint: "The modern tool is iproute2. Use 'r' as shorthand.",
    solution: "ip r",
    explain: "Routes tell you if destination is local or must go via the default gateway. Look for 'default via X.X.X.X'."
  },
  {
    id: "linux-route-get",
    category: "Linux Basics",
    title: "Check which route will be used",
    desc: "Goal: See which interface and gateway will be used for a specific destination.",
    prompt: "Type the command to check routing decision for 8.8.8.8.",
    accepted: [
      /^ip\s+route\s+get\s+8\.8\.8\.8$/,
      /^ip\s+r\s+get\s+8\.8\.8\.8$/
    ],
    hint: "Use 'ip route get' followed by the destination IP.",
    solution: "ip route get 8.8.8.8",
    explain: "Shows which route entry matches and which interface/gateway will be used. Useful when you have multiple routes."
  },
  {
    id: "linux-ss-all",
    category: "Linux Basics",
    title: "Show all socket connections",
    desc: "Goal: Display both TCP and UDP connections, numeric addresses.",
    prompt: "Type the command to show all TCP and UDP connections.",
    accepted: [
      /^ss\s+-tuna$/,
      /^ss\s+-tnua$/,
      /^ss\s+-tan\s+-u$/,
      /^ss\s+-ua\s+-tn$/
    ],
    hint: "ss with flags: -t (TCP), -u (UDP), -n (numeric), -a (all states).",
    solution: "ss -tuna",
    explain: "Shows established connections and listening ports. -n shows IPs instead of hostnames (faster)."
  },
  {
    id: "linux-ss-listen",
    category: "Linux Basics",
    title: "Check listening TCP ports",
    desc: "Goal: List services listening on TCP ports (server health basics).",
    prompt: "Type the command to show listening TCP sockets with process info.",
    accepted: [
      /^ss\s+-ltnp$/,
      /^ss\s+-tlnp$/,
      /^ss\s+-ptnl$/
    ],
    hint: "ss replaces netstat; -l listening, -t tcp, -n numeric, -p process.",
    solution: "ss -ltnp",
    explain: "If the service isn't listening, no client connection can succeed. -p requires sudo for other users' processes."
  },
  {
    id: "linux-getent",
    category: "Linux Basics",
    title: "Check system name resolution",
    desc: "Goal: Confirm how the system resolves a hostname (not raw DNS only).",
    prompt: "Type the command to resolve example.com using the system resolver.",
    accepted: [
      /^getent\s+hosts\s+example\.com$/,
      /^getent\s+ahosts\s+example\.com$/
    ],
    hint: "dig bypasses NSS; you want the libc/NSS path that apps use.",
    solution: "getent hosts example.com",
    explain: "getent follows /etc/nsswitch.conf and reflects what apps typically use. Checks /etc/hosts before DNS."
  },

  // DNS Pack
  {
    id: "dns-dig-basic",
    category: "DNS",
    title: "Perform basic DNS lookup",
    desc: "Goal: Query DNS for A record of a domain.",
    prompt: "Type the command to look up the IP address of google.com.",
    accepted: [
      /^dig\s+google\.com$/,
      /^dig\s+google\.com\s+A$/
    ],
    hint: "Use dig followed by the domain name.",
    solution: "dig google.com",
    explain: "Shows DNS query/response including authoritative servers, TTL, and the IP address in the ANSWER section."
  },
  {
    id: "dns-dig-trace",
    category: "DNS",
    title: "Trace full DNS resolution path",
    desc: "Goal: See the complete chain from root servers to final answer.",
    prompt: "Type the command to trace DNS resolution for facebook.com.",
    accepted: [
      /^dig\s+\+trace\s+facebook\.com$/,
      /^dig\s+facebook\.com\s+\+trace$/
    ],
    hint: "Use dig with the +trace flag.",
    solution: "dig +trace facebook.com",
    explain: "Shows queries to root servers, TLD servers, and authoritative nameservers. Great for debugging delegation issues."
  },
  {
    id: "dns-specific-server",
    category: "DNS",
    title: "Query specific DNS server",
    desc: "Goal: Test if a specific DNS server responds correctly.",
    prompt: "Type the command to query 8.8.8.8 for cloudflare.com.",
    accepted: [
      /^dig\s+@8\.8\.8\.8\s+cloudflare\.com$/,
      /^dig\s+cloudflare\.com\s+@8\.8\.8\.8$/
    ],
    hint: "Use @ symbol followed by DNS server IP.",
    solution: "dig @8.8.8.8 cloudflare.com",
    explain: "Bypasses your default resolver. Useful for comparing results from different DNS servers."
  },
  {
    id: "dns-reverse",
    category: "DNS",
    title: "Reverse DNS lookup",
    desc: "Goal: Find the hostname for an IP address.",
    prompt: "Type the command to do reverse lookup for 8.8.8.8.",
    accepted: [
      /^dig\s+-x\s+8\.8\.8\.8$/,
      /^dig\s+\-x\s+8\.8\.8\.8$/
    ],
    hint: "Use the -x flag with dig.",
    solution: "dig -x 8.8.8.8",
    explain: "Queries PTR records. Returns 'dns.google' for 8.8.8.8. Not all IPs have reverse DNS configured."
  },
  {
    id: "dns-resolv-conf",
    category: "DNS",
    title: "Check DNS resolver configuration",
    desc: "Goal: See which DNS servers your system is configured to use.",
    prompt: "Type the command to view DNS resolver config file.",
    accepted: [
      /^cat\s+\/etc\/resolv\.conf$/,
      /^less\s+\/etc\/resolv\.conf$/,
      /^more\s+\/etc\/resolv\.conf$/
    ],
    hint: "The config file is /etc/resolv.conf.",
    solution: "cat /etc/resolv.conf",
    explain: "Shows 'nameserver' entries (DNS servers used). On some systems, this is auto-generated by DHCP or systemd-resolved."
  },

  // ARP/Neighbor Pack
  {
    id: "arp-show",
    category: "ARP",
    title: "View ARP/neighbor cache",
    desc: "Goal: See Layer 2 MAC address mappings for Layer 3 IPs.",
    prompt: "Type the command to show the neighbor cache.",
    accepted: [
      /^ip\s+neigh$/,
      /^ip\s+neighbor$/,
      /^ip\s+n$/,
      /^ip\s+neigh\s+show$/
    ],
    hint: "Use iproute2 'ip' command with 'neigh' or 'n'.",
    solution: "ip neigh",
    explain: "Shows MAC addresses for IPs on local network. States: REACHABLE (fresh), STALE (old), DELAY/PROBE (testing), FAILED."
  },
  {
    id: "arp-flush",
    category: "ARP",
    title: "Flush neighbor cache entry",
    desc: "Goal: Clear a specific ARP entry to force re-resolution.",
    prompt: "Type the command to delete neighbor entry for 192.168.1.1 on eth0.",
    accepted: [
      /^ip\s+neigh\s+del\s+192\.168\.1\.1\s+dev\s+eth0$/,
      /^ip\s+neighbor\s+delete\s+192\.168\.1\.1\s+dev\s+eth0$/,
      /^ip\s+n\s+del\s+192\.168\.1\.1\s+dev\s+eth0$/
    ],
    hint: "Use 'ip neigh del <ip> dev <interface>'.",
    solution: "ip neigh del 192.168.1.1 dev eth0",
    explain: "Forces new ARP resolution. Useful when MAC address changed but cache is stale."
  },

  // TCP Pack
  {
    id: "tcp-nc-test",
    category: "TCP",
    title: "Test TCP port connectivity",
    desc: "Goal: Check if you can connect to a specific TCP port.",
    prompt: "Type the command to test TCP connection to example.com port 443.",
    accepted: [
      /^nc\s+-vz\s+example\.com\s+443$/,
      /^nc\s+-zv\s+example\.com\s+443$/
    ],
    hint: "Use netcat (nc) with -v (verbose) and -z (zero I/O, just test).",
    solution: "nc -vz example.com 443",
    explain: "Tests TCP 3-way handshake. 'succeeded' = port open. 'refused' = port closed. Timeout = filtered/unreachable."
  },
  {
    id: "tcp-curl-verbose",
    category: "TCP",
    title: "Make verbose HTTP request",
    desc: "Goal: See full HTTP/TLS connection details.",
    prompt: "Type the command to make a verbose HTTPS request to google.com.",
    accepted: [
      /^curl\s+-v\s+https:\/\/google\.com$/,
      /^curl\s+--verbose\s+https:\/\/google\.com$/,
      /^curl\s+-v\s+https:\/\/google\.com\/$/
    ],
    hint: "Use curl with -v flag.",
    solution: "curl -v https://google.com",
    explain: "Shows DNS lookup, TCP handshake, TLS negotiation, HTTP headers. Useful for debugging connection issues."
  },
  {
    id: "tcp-ss-info",
    category: "TCP",
    title: "Show detailed TCP connection info",
    desc: "Goal: See TCP state, timers, retransmissions for a connection.",
    prompt: "Type the command to show TCP info for connections to 1.1.1.1.",
    accepted: [
      /^ss\s+-ti\s+dst\s+1\.1\.1\.1$/,
      /^ss\s+-ti\s+'dst\s+1\.1\.1\.1'$/
    ],
    hint: "Use ss with -t (TCP), -i (info), dst (destination filter).",
    solution: "ss -ti dst 1.1.1.1",
    explain: "Shows congestion window (cwnd), retransmissions, RTT, ssthresh. Critical for TCP performance debugging."
  },
  {
    id: "tcp-tcpdump-capture",
    category: "TCP",
    title: "Capture TCP packets",
    desc: "Goal: Capture TCP traffic to/from a specific host and port.",
    prompt: "Type the command to capture TCP packets to example.com port 443.",
    accepted: [
      /^tcpdump\s+-i\s+any\s+'tcp\s+and\s+host\s+example\.com\s+and\s+port\s+443'$/,
      /^tcpdump\s+'tcp\s+and\s+host\s+example\.com\s+and\s+port\s+443'$/,
      /^tcpdump\s+-i\s+any\s+'host\s+example\.com\s+and\s+port\s+443\s+and\s+tcp'$/
    ],
    hint: "Use tcpdump with BPF filter. Combine 'tcp and host X and port Y'.",
    solution: "tcpdump -i any 'tcp and host example.com and port 443'",
    explain: "Captures packets at wire level. Shows SYN/ACK/FIN flags, sequence numbers. Requires sudo. Save with -w for Wireshark."
  },

  // Path / Loss Pack
  {
    id: "path-ping",
    category: "Path/Loss",
    title: "Test basic connectivity with ping",
    desc: "Goal: Check if host is reachable and measure RTT.",
    prompt: "Type the command to ping 8.8.8.8 five times.",
    accepted: [
      /^ping\s+-c\s+5\s+8\.8\.8\.8$/,
      /^ping\s+8\.8\.8\.8\s+-c\s+5$/
    ],
    hint: "Use ping with -c flag to limit count.",
    solution: "ping -c 5 8.8.8.8",
    explain: "ICMP echo request/reply. Shows RTT and packet loss. 0% loss is ideal. High RTT = latency. Timeouts = unreachable/filtered."
  },
  {
    id: "path-traceroute",
    category: "Path/Loss",
    title: "Trace network path",
    desc: "Goal: See all hops between you and destination.",
    prompt: "Type the command to trace route to google.com.",
    accepted: [
      /^traceroute\s+google\.com$/,
      /^traceroute\s+-I\s+google\.com$/
    ],
    hint: "Use traceroute command.",
    solution: "traceroute google.com",
    explain: "Shows each router hop. * * * means no response (not always a problem). High latency at specific hop = bottleneck there."
  },
  {
    id: "path-mtr",
    category: "Path/Loss",
    title: "Diagnose path loss/latency quickly",
    desc: "Goal: See per-hop latency and loss continuously.",
    prompt: "Type a command to measure hop-by-hop latency/loss to 1.1.1.1 in report mode.",
    accepted: [
      /^mtr\s+-rw\s+1\.1\.1\.1$/,
      /^mtr\s+-r\s+1\.1\.1\.1$/,
      /^mtr\s+1\.1\.1\.1$/
    ],
    hint: "mtr combines ping and traceroute. Use -r for report mode, -w for wide.",
    solution: "mtr -rw 1.1.1.1",
    explain: "mtr helps localize where loss/latency starts. ICMP rate-limit can mislead. Look for patterns across multiple hops."
  },

  // Interface Stats Pack
  {
    id: "stats-interface",
    category: "Stats",
    title: "Check interface errors and drops",
    desc: "Goal: See if packets are being dropped at interface level.",
    prompt: "Type the command to show statistics for interface eth0.",
    accepted: [
      /^ip\s+-s\s+link\s+show\s+eth0$/,
      /^ip\s+-s\s+link\s+show\s+dev\s+eth0$/,
      /^ip\s+-s\s+l\s+show\s+eth0$/
    ],
    hint: "Use ip -s link to show statistics.",
    solution: "ip -s link show eth0",
    explain: "RX errors = receive problems (bad cable/NIC). TX drops = transmit buffer full. Collisions = duplex mismatch."
  },
  {
    id: "stats-netstat",
    category: "Stats",
    title: "Show protocol statistics",
    desc: "Goal: See TCP retransmissions, failed connections, etc.",
    prompt: "Type the command to show TCP statistics.",
    accepted: [
      /^netstat\s+-s$/,
      /^netstat\s+-st$/,
      /^ss\s+-s$/
    ],
    hint: "Use netstat -s or ss -s.",
    solution: "netstat -s",
    explain: "Shows counters for all protocols. Look for 'segments retransmitted' (TCP issues), 'connection resets' (app/firewall)."
  }
];

// Helper: normalize input
function normalize(cmd) {
  return cmd.trim()
    .replace(/\s+/g, " ")
    .replace(/^sudo\s+/, ""); // allow sudo but ignore it in checks
}

// Create exercise card
function createExerciseCard(ex) {
  const card = document.createElement("div");
  card.className = "ex-card";

  card.innerHTML = `
    <div class="ex-category">${ex.category}</div>
    <div class="ex-title">${ex.title}</div>
    <div class="ex-desc">${ex.desc}</div>
    <div class="ex-prompt">${ex.prompt}</div>
    <textarea class="ex-input mono" rows="2" placeholder="Type command here..."></textarea>
    <div class="ex-row">
      <button class="btn check">Check</button>
      <button class="btn show">Show solution</button>
      <span class="result"></span>
    </div>
    <div class="hint"></div>
    <div class="expl"></div>
  `;

  const input = card.querySelector("textarea");
  const result = card.querySelector(".result");
  const hint = card.querySelector(".hint");
  const expl = card.querySelector(".expl");

  card.querySelector(".check").onclick = () => {
    const val = normalize(input.value);
    const ok = ex.accepted.some(rx => rx.test(val));
    if (ok) {
      result.textContent = "✓ Correct";
      result.className = "result ok";
      hint.textContent = "";
      expl.textContent = ex.explain;
      expl.className = "expl show";
    } else {
      result.textContent = "✗ Not quite";
      result.className = "result bad";
      hint.textContent = "💡 Hint: " + ex.hint;
      hint.className = "hint show";
      expl.textContent = "";
    }
  };

  card.querySelector(".show").onclick = () => {
    input.value = ex.solution;
    result.textContent = "";
    hint.textContent = "";
    expl.textContent = "📖 Explanation: " + ex.explain;
    expl.className = "expl show";
  };

  return card;
}

// Get exercise by ID
function getExerciseById(id) {
  return EXERCISES.find(ex => ex.id === id);
}

// Create inline mini exercise (compact version for embedding in modules)
function createInlineExercise(exerciseId) {
  const ex = getExerciseById(exerciseId);
  if (!ex) return document.createElement('div');

  const card = document.createElement("div");
  card.className = "inline-exercise";
  
  card.innerHTML = `
    <div class="inline-ex-header">
      <span class="inline-ex-icon">💻</span>
      <span class="inline-ex-title">${ex.title}</span>
    </div>
    <div class="inline-ex-prompt">${ex.prompt}</div>
    <textarea class="ex-input mono" rows="1" placeholder="Type command here..."></textarea>
    <div class="ex-row">
      <button class="btn check">Check</button>
      <button class="btn show-hint">Hint</button>
      <button class="btn show">Solution</button>
      <span class="result"></span>
    </div>
    <div class="hint"></div>
    <div class="expl"></div>
  `;

  const input = card.querySelector("textarea");
  const result = card.querySelector(".result");
  const hint = card.querySelector(".hint");
  const expl = card.querySelector(".expl");

  card.querySelector(".check").onclick = () => {
    const val = normalize(input.value);
    const ok = ex.accepted.some(rx => rx.test(val));
    if (ok) {
      result.textContent = "✓ Correct!";
      result.className = "result ok";
      hint.textContent = "";
      hint.className = "hint";
      expl.textContent = ex.explain;
      expl.className = "expl show";
    } else {
      result.textContent = "✗ Try again";
      result.className = "result bad";
      hint.textContent = "";
      hint.className = "hint";
      expl.textContent = "";
      expl.className = "expl";
    }
  };

  card.querySelector(".show-hint").onclick = () => {
    hint.textContent = "💡 " + ex.hint;
    hint.className = "hint show";
  };

  card.querySelector(".show").onclick = () => {
    input.value = ex.solution;
    result.textContent = "";
    hint.textContent = "";
    hint.className = "hint";
    expl.textContent = "📖 " + ex.explain;
    expl.className = "expl show";
  };

  return card;
}

// Render inline exercise into module content
function renderInlineExercise(exerciseId) {
  const ex = createInlineExercise(exerciseId);
  return ex.outerHTML;
}

// Initialize exercises
function initExercises(containerId, category = null) {
  const root = document.getElementById(containerId);
  if (!root) return;

  const filtered = category 
    ? EXERCISES.filter(ex => ex.category === category)
    : EXERCISES;

  if (filtered.length === 0) {
    root.innerHTML = '<p class="muted">No exercises available for this category yet.</p>';
    return;
  }

  filtered.forEach(ex => root.appendChild(createExerciseCard(ex)));
}

// Group exercises by category
function initExercisesByCategory(containerId) {
  const root = document.getElementById(containerId);
  if (!root) return;

  const categories = {};
  EXERCISES.forEach(ex => {
    if (!categories[ex.category]) {
      categories[ex.category] = [];
    }
    categories[ex.category].push(ex);
  });

  Object.keys(categories).sort().forEach(category => {
    const section = document.createElement("div");
    section.className = "exercise-section";
    section.innerHTML = `<h3 class="exercise-section-title">${category}</h3>`;
    
    categories[category].forEach(ex => {
      section.appendChild(createExerciseCard(ex));
    });
    
    root.appendChild(section);
  });
}
