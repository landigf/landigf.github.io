// Module content data
const modules = {
    fundamentals: {
        title: "Networking Fundamentals",
        content: `
            <div class="section">
                <h2 class="section-title">🌐 Networking Fundamentals</h2>
                
                <div class="subsection">
                    <h3>📍 ARP (Address Resolution Protocol)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Maps IP addresses (Layer 3) to MAC addresses (Layer 2)</p>
                        
                        <p><strong>Why needed?</strong> Devices on same network segment need MAC addresses to communicate at Layer 2</p>
                        
                        <ul>
                            <li><strong>ARP Request:</strong> Broadcast - "Who has IP 192.168.1.5? Tell 192.168.1.10"</li>
                            <li><strong>ARP Reply:</strong> Unicast - "192.168.1.5 is at MAC aa:bb:cc:dd:ee:ff"</li>
                            <li><strong>ARP Cache:</strong> Temporary storage to avoid repeated requests</li>
                        </ul>
                    </div>

                    <div class="diagram">
Computer A (192.168.1.10)                Computer B (192.168.1.5)
        |                                          |
        |  ARP Request (Broadcast)                |
        |  "Who has 192.168.1.5?"                 |
        |----------------------------------------->|
        |                                          |
        |  ARP Reply (Unicast)                    |
        |  "I'm 192.168.1.5, MAC: aa:bb:cc..."   |
        |<-----------------------------------------|
        |                                          |
        |  Now can send data using MAC address    |
                    </div>

                    <div class="inline-exercise-placeholder" data-exercise="arp-view"></div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Practice Exercise</div>
                        <p>Run these commands in your terminal:</p>
                        <div class="command-box">
<code># View your ARP cache
arp -a

# View detailed ARP table (Linux)
ip neigh show

# Flush ARP cache (requires sudo)
sudo arp -d -a   # macOS
sudo ip neigh flush all   # Linux

# Watch ARP cache update in real-time
watch -n 1 "arp -a"</code>
                        </div>
                        <p><strong>What to observe:</strong></p>
                        <ul>
                            <li>Which devices are in your ARP cache?</li>
                            <li>What's the default gateway's MAC address?</li>
                            <li>How long do entries stay (TTL)?</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "You plug a new computer into a network. Walk me through what happens when it tries to ping another computer on the same subnet."</strong></p>
                        
                        <p><strong>Answer:</strong></p>
                        <ol>
                            <li>Computer checks if destination IP is on same subnet (subnet mask comparison)</li>
                            <li>Computer checks ARP cache for destination MAC - not found (new computer)</li>
                            <li>Computer sends ARP request broadcast: "Who has [target IP]?"</li>
                            <li>All devices receive broadcast, only target responds with ARP reply containing its MAC</li>
                            <li>Computer stores MAC in ARP cache</li>
                            <li>Computer constructs Ethernet frame with destination MAC and sends ICMP echo request</li>
                            <li>Target responds with ICMP echo reply</li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔍 DNS (Domain Name System)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Translates human-readable domain names to IP addresses</p>
                        <p><strong>Hierarchy:</strong> Root → TLD (.com) → Authoritative nameserver → Record</p>
                        <p><strong>Key Record Types:</strong></p>
                        <ul>
                            <li><strong>A:</strong> IPv4 address (example.com → 93.184.216.34)</li>
                            <li><strong>AAAA:</strong> IPv6 address</li>
                            <li><strong>CNAME:</strong> Canonical name (alias)</li>
                            <li><strong>MX:</strong> Mail server</li>
                            <li><strong>NS:</strong> Nameserver</li>
                            <li><strong>PTR:</strong> Reverse DNS (IP → domain)</li>
                        </ul>
                    </div>

                    <div class="diagram">
DNS Resolution Process:

Client → Local DNS Cache (not found)
       ↓
Client → Recursive Resolver (ISP/8.8.8.8)
       ↓
Resolver → Root Server (. servers)
         "Try .com servers"
       ↓
Resolver → TLD Server (.com servers)
         "Try example.com nameserver"
       ↓
Resolver → Authoritative NS (example.com)
         "example.com is 93.184.216.34"
       ↓
Client ← IP address cached and returned
                    </div>

                    <div class="inline-exercise-placeholder" data-exercise="dns-dig-basic"></div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Practice Exercise</div>
                        <div class="command-box">
<code># Query DNS records
dig google.com
nslookup google.com
host google.com

# Trace DNS resolution path
dig +trace google.com

# Query specific record types
dig google.com A
dig google.com AAAA
dig google.com MX
dig google.com NS

# Reverse DNS lookup
dig -x 8.8.8.8

# Use specific DNS server
dig @8.8.8.8 google.com

# View local DNS cache (macOS)
sudo dscacheutil -cachedump -entries Host

# Flush DNS cache
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code>
                        </div>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "A user reports website not loading. How do you troubleshoot if it's DNS?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ol>
                            <li>Try accessing by IP directly - if works, DNS issue</li>
                            <li>Check if DNS server is reachable: <code>ping 8.8.8.8</code></li>
                            <li>Query different DNS servers: <code>dig @8.8.8.8 domain.com</code> vs <code>dig @1.1.1.1 domain.com</code></li>
                            <li>Check DNS response time and errors</li>
                            <li>Verify DNS configuration: <code>cat /etc/resolv.conf</code></li>
                            <li>Check for DNS cache poisoning or stale entries</li>
                            <li>Use nslookup/dig to see full query path</li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🎯 DHCP (Dynamic Host Configuration Protocol)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Automatically assigns IP addresses and network configuration</p>
                        <p><strong>DORA Process:</strong></p>
                        <ol>
                            <li><strong>Discover:</strong> Client broadcasts "I need an IP"</li>
                            <li><strong>Offer:</strong> DHCP server offers an IP</li>
                            <li><strong>Request:</strong> Client requests the offered IP</li>
                            <li><strong>Acknowledge:</strong> Server confirms and provides:
                                <ul>
                                    <li>IP address</li>
                                    <li>Subnet mask</li>
                                    <li>Default gateway</li>
                                    <li>DNS servers</li>
                                    <li>Lease time</li>
                                </ul>
                            </li>
                        </ol>
                    </div>

                    <div class="diagram">
DHCP DORA Process:

Client                    DHCP Server
  |                             |
  | DHCP Discover (Broadcast)  |
  |  "Need IP please!"          |
  |---------------------------->|
  |                             |
  | DHCP Offer                  |
  |  "Here's 192.168.1.100"    |
  |<----------------------------|
  |                             |
  | DHCP Request                |
  |  "I'll take 192.168.1.100" |
  |---------------------------->|
  |                             |
  | DHCP Ack                    |
  |  "Confirmed + config"       |
  |<----------------------------|
                    </div>

                    <div class="inline-exercise-placeholder" data-exercise="dhcp-view-lease"></div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Practice Exercise</div>
                        <div class="command-box">
<code># View DHCP lease info
ipconfig getpacket en0   # macOS
cat /var/lib/dhcp/dhclient.leases   # Linux

# Renew DHCP lease
sudo ipconfig set en0 DHCP   # macOS
sudo dhclient -r && sudo dhclient   # Linux

# View network interface configuration
ifconfig en0   # macOS
ip addr show   # Linux

# View routing table (includes default gateway from DHCP)
netstat -nr
ip route show</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔄 NAT (Network Address Translation)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Allows multiple devices with private IPs to share one public IP</p>
                        <p><strong>Why needed?</strong> IPv4 address exhaustion</p>
                        <p><strong>Types:</strong></p>
                        <ul>
                            <li><strong>Static NAT:</strong> 1:1 mapping (one private IP → one public IP)</li>
                            <li><strong>Dynamic NAT:</strong> Pool of public IPs assigned dynamically</li>
                            <li><strong>PAT (Port Address Translation / NAT Overload):</strong> Many private IPs → one public IP using different ports</li>
                        </ul>
                    </div>

                    <div class="diagram">
PAT Example (most common):

Internal Network          NAT Router              Internet
192.168.1.10:5000    →  [Translate]  →   203.0.113.5:10000  →  Server
192.168.1.15:5001    →  [Translate]  →   203.0.113.5:10001  →  Server

NAT Table:
Inside Local        Inside Global
192.168.1.10:5000  ↔  203.0.113.5:10000
192.168.1.15:5001  ↔  203.0.113.5:10001
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Explain the pros and cons of NAT."</strong></p>
                        <div class="pro-con">
                            <div class="pros">
                                <h4>✅ Pros:</h4>
                                <ul>
                                    <li>Conserves public IPv4 addresses</li>
                                    <li>Adds security layer (hides internal topology)</li>
                                    <li>Allows network redesign without changing public IP</li>
                                    <li>Enables private networks to access internet</li>
                                </ul>
                            </div>
                            <div class="cons">
                                <h4>❌ Cons:</h4>
                                <ul>
                                    <li>Breaks end-to-end connectivity principle</li>
                                    <li>Complicates peer-to-peer applications</li>
                                    <li>Adds latency (translation overhead)</li>
                                    <li>Makes logging/troubleshooting harder</li>
                                    <li>Doesn't work well with some protocols (FTP, SIP)</li>
                                    <li>Creates single point of failure</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📊 IPv4 & Subnetting</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>IPv4 Address:</strong> 32 bits, written as 4 octets (192.168.1.1)</p>
                        <p><strong>Classes (historical):</strong></p>
                        <ul>
                            <li><strong>Class A:</strong> 0.0.0.0 - 127.255.255.255 (8-bit network, 24-bit host)</li>
                            <li><strong>Class B:</strong> 128.0.0.0 - 191.255.255.255 (16-bit network, 16-bit host)</li>
                            <li><strong>Class C:</strong> 192.0.0.0 - 223.255.255.255 (24-bit network, 8-bit host)</li>
                        </ul>
                        
                        <p><strong>Private IP Ranges (RFC 1918):</strong></p>
                        <ul>
                            <li>10.0.0.0/8 (10.0.0.0 - 10.255.255.255)</li>
                            <li>172.16.0.0/12 (172.16.0.0 - 172.31.255.255)</li>
                            <li>192.168.0.0/16 (192.168.0.0 - 192.168.255.255)</li>
                        </ul>

                        <p><strong>CIDR Notation:</strong> 192.168.1.0/24</p>
                        <ul>
                            <li>/24 = 255.255.255.0 (24 bits for network, 8 for hosts)</li>
                            <li>Usable hosts = 2^8 - 2 = 254 (minus network & broadcast)</li>
                        </ul>
                    </div>

                    <div class="inline-exercise-placeholder" data-exercise="subnet-calculate"></div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Subnetting Practice</div>
                        <p><strong>Given: 192.168.1.0/24, create 4 subnets</strong></p>
                        <ol>
                            <li>Need 2 bits for 4 subnets (2^2 = 4)</li>
                            <li>New subnet mask: /26 (255.255.255.192)</li>
                            <li>Each subnet has 2^6 - 2 = 62 usable hosts</li>
                            <li>Subnets:
                                <ul>
                                    <li>192.168.1.0/26 (0-63)</li>
                                    <li>192.168.1.64/26 (64-127)</li>
                                    <li>192.168.1.128/26 (128-191)</li>
                                    <li>192.168.1.192/26 (192-255)</li>
                                </ul>
                            </li>
                        </ol>
                        
                        <div class="command-box">
<code># Calculate subnet info
ipcalc 192.168.1.0/24   # Linux (may need to install)

# View your IP and subnet mask
ifconfig | grep inet
ip addr show

# Manual calculation:
# /24 = 11111111.11111111.11111111.00000000
# /26 = 11111111.11111111.11111111.11000000</code>
                        </div>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "How many usable hosts in a /28 network?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ul>
                            <li>/28 = 32 - 28 = 4 host bits</li>
                            <li>Total addresses = 2^4 = 16</li>
                            <li>Usable hosts = 16 - 2 = 14</li>
                            <li>(-2 for network address and broadcast address)</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🌍 IPv6</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>IPv6 Address:</strong> 128 bits, written as 8 groups of 4 hex digits</p>
                        <p><strong>Example:</strong> 2001:0db8:85a3:0000:0000:8a2e:0370:7334</p>
                        
                        <p><strong>Shortening rules:</strong></p>
                        <ul>
                            <li>Remove leading zeros: 0042 → 42</li>
                            <li>Replace consecutive zeros with ::</li>
                            <li>2001:0db8:0000:0000:0000:0000:0000:0001 → 2001:db8::1</li>
                        </ul>

                        <p><strong>Key differences from IPv4:</strong></p>
                        <ul>
                            <li>No broadcast (uses multicast)</li>
                            <li>No NAT needed (huge address space)</li>
                            <li>Built-in IPsec support</li>
                            <li>No ARP (uses Neighbor Discovery Protocol)</li>
                            <li>No DHCP needed (SLAAC - Stateless Address Autoconfiguration)</li>
                        </ul>

                        <p><strong>Address types:</strong></p>
                        <ul>
                            <li><strong>Unicast:</strong> One-to-one</li>
                            <li><strong>Multicast:</strong> One-to-many (ff00::/8)</li>
                            <li><strong>Anycast:</strong> One-to-nearest</li>
                            <li><strong>Link-local:</strong> fe80::/10 (not routable)</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Why hasn't IPv6 been fully adopted yet?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ul>
                            <li>NAT worked "well enough" to delay IPv4 exhaustion</li>
                            <li>Infrastructure upgrade costs are high</li>
                            <li>Dual-stack complexity</li>
                            <li>Legacy application compatibility</li>
                            <li>Training and knowledge gap</li>
                            <li>Network effects: providers wait for users, users wait for content</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>✅ Module Checklist</h3>
                    <ul class="checklist">
                        <li>I can explain ARP process with a diagram</li>
                        <li>I can describe DNS resolution step by step</li>
                        <li>I can explain DHCP DORA process</li>
                        <li>I understand NAT types and can list pros/cons</li>
                        <li>I can subnet a network and calculate usable hosts</li>
                        <li>I can explain IPv6 addressing and key differences from IPv4</li>
                        <li>I practiced all terminal commands</li>
                    </ul>
                </div>
            </div>
        `
    },
    
    tcp: {
        title: "TCP Deep Dive",
        content: `
            <div class="section">
                <h2 class="section-title">🔌 TCP Deep Dive</h2>
                
                <div class="subsection">
                    <h3>🤝 Three-Way Handshake</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Establish reliable connection before data transfer</p>
                        <p><strong>Steps:</strong></p>
                        <ol>
                            <li><strong>SYN:</strong> Client → Server (SEQ=x, "Let's connect")</li>
                            <li><strong>SYN-ACK:</strong> Server → Client (SEQ=y, ACK=x+1, "OK, ready")</li>
                            <li><strong>ACK:</strong> Client → Server (ACK=y+1, "Connection established")</li>
                        </ol>
                    </div>

                    <div class="diagram">
Client                                    Server
  |                                         |
  | SYN (SEQ=1000)                         |
  |  "I want to connect"                   |
  |---------------------------------------->|
  |                                         | (Server allocates resources)
  |                                         |
  | SYN-ACK (SEQ=5000, ACK=1001)          |
  |  "OK, I'm ready too"                   |
  |<----------------------------------------|
  | (Client allocates resources)            |
  |                                         |
  | ACK (ACK=5001)                         |
  |  "Connection established!"             |
  |---------------------------------------->|
  |                                         |
  | <<< Data transfer can now begin >>>    |
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Practice Exercise</div>
                        <p><strong>Capture and analyze TCP handshake:</strong></p>
                        <div class="command-box">
<code># Capture TCP handshake (run in terminal 1)
sudo tcpdump -i any 'tcp and port 80' -nn -vv

# Then in terminal 2, make a connection
curl -I http://example.com

# Better: save to file for analysis
sudo tcpdump -i any 'tcp and port 443' -w handshake.pcap -c 20
# Open handshake.pcap in Wireshark

# Watch live connections
sudo tcpdump -i any 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' -nn

# Alternative: use ss to see connection states
watch -n 1 "ss -tan | grep SYN"</code>
                        </div>
                        <p><strong>What to observe:</strong></p>
                        <ul>
                            <li>SYN packet with initial sequence number</li>
                            <li>SYN-ACK with server's sequence number and ACK of client's SEQ+1</li>
                            <li>Final ACK completing handshake</li>
                            <li>Timing between packets</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "What's a SYN flood attack and how do you mitigate it?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <p><strong>Attack:</strong> Attacker sends many SYN packets but never completes handshake. Server keeps half-open connections, exhausting resources.</p>
                        <p><strong>Mitigation:</strong></p>
                        <ul>
                            <li><strong>SYN Cookies:</strong> Don't allocate resources until ACK received</li>
                            <li><strong>Reduce timeout:</strong> Lower SYN-RECEIVED timeout value</li>
                            <li><strong>Increase backlog:</strong> Increase SYN queue size</li>
                            <li><strong>Firewall rules:</strong> Rate limit SYN packets per source</li>
                            <li><strong>Load balancer:</strong> Absorb attacks before reaching servers</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📊 Flow Control (Sliding Window)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Prevent sender from overwhelming receiver</p>
                        <p><strong>Mechanism:</strong> Receiver advertises window size (buffer space available)</p>
                        <p><strong>How it works:</strong></p>
                        <ul>
                            <li>Receiver includes "Window Size" in every ACK</li>
                            <li>Sender can only send up to window size bytes before waiting for ACK</li>
                            <li>Window slides forward as ACKs are received</li>
                            <li>Window size of 0 = "Stop sending, I'm full"</li>
                        </ul>
                    </div>

                    <div class="diagram">
Sliding Window Example (Window Size = 4 segments):

Sender's view:
[1][2][3][4] | [5][6][7][8]
 ^^^^^^^^^^^   
   Can send these 4 immediately

After sending 1-4, waiting for ACK...

ACK for 1,2 received → Window slides:
    [3][4][5][6] | [7][8][9][10]
     ^^^^^^^^^^^
     Can now send 5,6

Window Size Advertisement:
- Receiver: "Window = 8192 bytes" (I have 8KB buffer free)
- Sender: Can send 8192 bytes before waiting
- Receiver: "Window = 4096 bytes" (Buffer filling up)
- Sender: Slow down, only send 4096 bytes
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "What's the difference between flow control and congestion control?"</strong></p>
                        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Aspect</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Flow Control</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Congestion Control</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Purpose</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Prevent receiver overload</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Prevent network overload</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Controlled by</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Receiver (window size)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Sender (cwnd)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Mechanism</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Sliding window</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Slow start, AIMD</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Detection</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Explicit (window=0)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Implicit (packet loss)</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🚦 Congestion Control</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Core Concept</div>
                        <p><strong>Purpose:</strong> Prevent network congestion from packet loss</p>
                        <p><strong>Key algorithms:</strong></p>
                        
                        <h4>1. Slow Start</h4>
                        <ul>
                            <li>Start with small congestion window (cwnd = 1 MSS)</li>
                            <li>Double cwnd for each ACK received (exponential growth)</li>
                            <li>Continue until reaching ssthresh (slow start threshold) or packet loss</li>
                        </ul>

                        <h4>2. Congestion Avoidance (AIMD)</h4>
                        <ul>
                            <li><strong>Additive Increase:</strong> cwnd += 1 MSS per RTT</li>
                            <li><strong>Multiplicative Decrease:</strong> On packet loss, cwnd = cwnd/2</li>
                        </ul>

                        <h4>3. Fast Retransmit & Fast Recovery</h4>
                        <ul>
                            <li><strong>Fast Retransmit:</strong> After 3 duplicate ACKs, retransmit immediately (don't wait for timeout)</li>
                            <li><strong>Fast Recovery:</strong> Don't go back to slow start, just halve cwnd</li>
                        </ul>
                    </div>

                    <div class="diagram">
Congestion Window Over Time:

cwnd
 |     Slow Start  | Congestion | Fast      | Congestion
 |     (exponential)| Avoidance  | Recovery  | Avoidance
 |                  | (linear)   |           |
 |            /|    /            \    /
 |          /  |  /              \  /
 |        /    | /                \/
 |      /      |/                  
 |    /        * <-- ssthresh      
 |  /          |                   * <-- 3 dup ACKs
 |/____________|___________________|____________> time
              timeout           3-dup-ACKs

States:
1. Slow Start: cwnd = 1, 2, 4, 8, 16... (exponential)
2. Hit ssthresh → switch to Congestion Avoidance
3. Congestion Avoidance: cwnd = 17, 18, 19... (linear)
4. Packet loss detected → Fast Recovery → cwnd/2
                    </div>

                    <div class="inline-exercise-placeholder" data-exercise="tcp-connections"></div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Practice Exercise</div>
                        <div class="command-box">
<code># View TCP congestion control algorithm in use
sysctl net.ipv4.tcp_congestion_control   # Linux
# Common algorithms: cubic, reno, bbr

# View TCP stats including retransmissions
netstat -s | grep -i retrans
ss -ti  # Show TCP info for all connections

# Monitor retransmissions in real-time
watch -n 1 "netstat -s | grep retransmit"

# Detailed TCP connection info
ss -tin  # Shows cwnd, ssthresh, rtt

# Simulate packet loss to see congestion control
sudo tc qdisc add dev en0 root netem loss 1%   # Add 1% loss
# Run a download and observe behavior
curl -O http://example.com/largefile
# Remove the packet loss
sudo tc qdisc del dev en0 root netem</code>
                        </div>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "You notice high packet retransmissions. How do you troubleshoot?"</strong></p>
                        <p><strong>Answer (systematic approach):</strong></p>
                        <ol>
                            <li><strong>Identify scope:</strong>
                                <ul>
                                    <li>Single connection or all traffic?</li>
                                    <li>Specific destination or everything?</li>
                                    <li><code>netstat -s | grep retransmit</code></li>
                                </ul>
                            </li>
                            <li><strong>Check network path:</strong>
                                <ul>
                                    <li>Packet loss: <code>ping -c 100 destination</code></li>
                                    <li>Where loss occurs: <code>mtr destination</code></li>
                                    <li>Latency spikes: <code>ping -i 0.2</code></li>
                                </ul>
                            </li>
                            <li><strong>Analyze TCP behavior:</strong>
                                <ul>
                                    <li>Capture with tcpdump and analyze in Wireshark</li>
                                    <li>Look for: duplicate ACKs, out-of-order packets, window size issues</li>
                                </ul>
                            </li>
                            <li><strong>Check both ends:</strong>
                                <ul>
                                    <li>Network interface errors: <code>ifconfig</code> (look for errors/drops)</li>
                                    <li>Buffer sizes: <code>sysctl net.ipv4.tcp_rmem</code></li>
                                    <li>CPU/memory on both client and server</li>
                                </ul>
                            </li>
                            <li><strong>Common causes:</strong>
                                <ul>
                                    <li>Network congestion (intermediate routers dropping packets)</li>
                                    <li>Faulty hardware (NIC, cable, switch)</li>
                                    <li>Asymmetric routing issues</li>
                                    <li>Firewall/middlebox problems</li>
                                    <li>MTU mismatch causing fragmentation</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔄 Connection Termination</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Four-Way Handshake</div>
                        <p><strong>Normal close (4 steps):</strong></p>
                        <ol>
                            <li><strong>FIN:</strong> Client → Server ("I'm done sending")</li>
                            <li><strong>ACK:</strong> Server → Client ("Got it")</li>
                            <li><strong>FIN:</strong> Server → Client ("I'm done too")</li>
                            <li><strong>ACK:</strong> Client → Server ("Goodbye")</li>
                        </ol>
                        <p><strong>Note:</strong> Can be 3-way if steps 2&3 combined (FIN-ACK)</p>
                    </div>

                    <div class="diagram">
Normal Termination:                Reset Termination:

Client        Server                Client        Server
  |              |                     |              |
  | FIN          |                     | RST          |
  |------------->|                     |------------->|
  |              |                     | (immediate)  |
  |         ACK  |                     
  |<-------------|                     
  |              |                     
  |         FIN  |                     
  |<-------------|                     
  |              |                     
  | ACK          |                     
  |------------->|                     
  |              |                     
  | TIME_WAIT    |                     
  | (2*MSL)      |                     

TIME_WAIT: 2*MSL (Maximum Segment Lifetime)
- Typically 60-120 seconds
- Ensures all packets are received/expired
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Why does TIME_WAIT state exist? What problems can it cause?"</strong></p>
                        <p><strong>Purpose of TIME_WAIT:</strong></p>
                        <ul>
                            <li>Ensure final ACK is received (if lost, server will retransmit FIN)</li>
                            <li>Ensure old duplicate packets from connection are expired</li>
                            <li>Prevent new connection with same 4-tuple from getting old packets</li>
                        </ul>
                        <p><strong>Problems:</strong></p>
                        <ul>
                            <li><strong>Port exhaustion:</strong> High-traffic servers with many connections can run out of ports</li>
                            <li><strong>Solution:</strong> Enable SO_REUSEADDR, increase port range, use connection pooling</li>
                        </ul>
                        <div class="command-box">
<code># Check TIME_WAIT connections
netstat -an | grep TIME_WAIT | wc -l
ss -tan | grep TIME-WAIT | wc -l

# Tune TIME_WAIT behavior (Linux)
sysctl net.ipv4.tcp_tw_reuse
sysctl net.ipv4.tcp_fin_timeout</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📦 TCP Segment Structure</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Important Fields</div>
                        <div class="diagram">
TCP Header (20 bytes minimum):

 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |           |U|A|P|R|S|F|                               |
| Offset| Reserved  |R|C|S|S|Y|I|            Window             |
|       |           |G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Key Flags:
- SYN: Synchronize sequence numbers (connection setup)
- ACK: Acknowledgment field is valid
- FIN: Finished, no more data
- RST: Reset connection (error)
- PSH: Push data to application immediately
- URG: Urgent pointer field is valid
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>✅ Module Checklist</h3>
                    <ul class="checklist">
                        <li>I can draw and explain 3-way handshake from memory</li>
                        <li>I understand flow control vs congestion control</li>
                        <li>I can explain slow start and congestion avoidance algorithms</li>
                        <li>I know how to troubleshoot high retransmissions</li>
                        <li>I can explain TIME_WAIT state and its purpose</li>
                        <li>I practiced capturing packets with tcpdump</li>
                        <li>I can explain fast retransmit and fast recovery</li>
                    </ul>
                </div>
            </div>
        `
    },

    bgp: {
        title: "BGP & Routing Protocols",
        content: `
            <div class="section">
                <h2 class="section-title">🌐 BGP & Routing Protocols</h2>
                
                <div class="subsection">
                    <h3>🎯 BGP Overview</h3>
                    
                    <div class="theory">
                        <div class="theory-title">What is BGP?</div>
                        <p><strong>BGP (Border Gateway Protocol):</strong> The routing protocol of the Internet</p>
                        <p><strong>Purpose:</strong> Exchange routing information between Autonomous Systems (AS)</p>
                        <p><strong>Key characteristics:</strong></p>
                        <ul>
                            <li><strong>Path vector protocol:</strong> Prevents routing loops by tracking full AS path</li>
                            <li><strong>Policy-based:</strong> Routing decisions based on business policies, not just metrics</li>
                            <li><strong>Scalable:</strong> Handles millions of routes</li>
                            <li><strong>Slow convergence:</strong> Stability over speed</li>
                            <li><strong>Uses TCP:</strong> Port 179 for reliable communication</li>
                        </ul>
                    </div>

                    <div class="diagram">
Internet Routing with BGP:

  [AS 65001]               [AS 65002]               [AS 65003]
   Company A   <---BGP--->   ISP 1    <---BGP--->   Company B
       |                       |                        |
    Internal              Internal                  Internal
     (OSPF)                (IS-IS)                   (OSPF)

BGP: Between ASes (External BGP - eBGP)
IGP: Within AS (OSPF, IS-IS, RIP) - Internal BGP (iBGP)

AS = Autonomous System (collection of networks under single admin)
                    </div>
                </div>

                <div class="subsection">
                    <h3>📨 BGP Message Types</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Four BGP Message Types</div>
                        
                        <h4>1. OPEN</h4>
                        <ul>
                            <li>First message after TCP connection established</li>
                            <li>Contains: BGP version, AS number, hold time, BGP identifier (router ID)</li>
                            <li>Negotiates BGP session parameters</li>
                        </ul>

                        <h4>2. UPDATE</h4>
                        <ul>
                            <li>Advertise new routes or withdraw old routes</li>
                            <li>Contains: Network prefixes, path attributes</li>
                            <li>This is where the routing magic happens!</li>
                        </ul>

                        <h4>3. KEEPALIVE</h4>
                        <ul>
                            <li>Sent periodically to maintain connection</li>
                            <li>Default: every 60 seconds</li>
                            <li>No data, just "I'm still here"</li>
                        </ul>

                        <h4>4. NOTIFICATION</h4>
                        <ul>
                            <li>Sent when error detected</li>
                            <li>Connection closes after NOTIFICATION</li>
                            <li>Contains error code and subcode</li>
                        </ul>
                    </div>

                    <div class="diagram">
BGP Session Establishment:

Router A                                Router B
   |                                       |
   | TCP SYN (port 179)                   |
   |------------------------------------->|
   |                                       |
   | TCP SYN-ACK                          |
   |<-------------------------------------|
   |                                       |
   | TCP ACK                              |
   |------------------------------------->|
   |                                       |
   | BGP OPEN                             |
   | (AS, version, hold time, router ID)  |
   |------------------------------------->|
   |                                       |
   | BGP OPEN                             |
   |<-------------------------------------|
   |                                       |
   | BGP KEEPALIVE                        |
   |<------------------------------------>|
   | (acknowledges OPEN)                  |
   |                                       |
   | BGP UPDATE (routing info)            |
   |<------------------------------------>|
   |                                       |
   | BGP KEEPALIVE (every 60s)           |
   |<------------------------------------>|
                    </div>
                </div>

                <div class="subsection">
                    <h3>🏆 BGP Path Attributes & Best Path Selection</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Key BGP Attributes</div>
                        
                        <h4>Well-known Mandatory:</h4>
                        <ul>
                            <li><strong>ORIGIN:</strong> How route was originated (IGP, EGP, Incomplete)</li>
                            <li><strong>AS_PATH:</strong> List of ASes route has traversed (loop prevention!)</li>
                            <li><strong>NEXT_HOP:</strong> Next router to reach destination</li>
                        </ul>

                        <h4>Well-known Discretionary:</h4>
                        <ul>
                            <li><strong>LOCAL_PREF:</strong> Prefer one route over another within AS (higher=better)</li>
                            <li><strong>ATOMIC_AGGREGATE:</strong> Route was aggregated</li>
                        </ul>

                        <h4>Optional Transitive:</h4>
                        <ul>
                            <li><strong>AGGREGATOR:</strong> Who aggregated the route</li>
                            <li><strong>COMMUNITY:</strong> Tag routes for policy decisions</li>
                        </ul>

                        <h4>Optional Non-transitive:</h4>
                        <ul>
                            <li><strong>MED (Multi-Exit Discriminator):</strong> Suggest which path to use (lower=better)</li>
                        </ul>
                    </div>

                    <div class="theory">
                        <div class="theory-title">Best Path Selection Algorithm</div>
                        <p><strong>BGP selects best path using this order (memorize this!):</strong></p>
                        <ol>
                            <li><strong>Highest WEIGHT</strong> (Cisco-specific, local to router)</li>
                            <li><strong>Highest LOCAL_PREF</strong> (prefer route within AS)</li>
                            <li><strong>Locally originated</strong> (prefer routes we injected)</li>
                            <li><strong>Shortest AS_PATH</strong> (fewest ASes to traverse)</li>
                            <li><strong>Lowest ORIGIN</strong> (IGP < EGP < Incomplete)</li>
                            <li><strong>Lowest MED</strong> (if from same AS)</li>
                            <li><strong>eBGP over iBGP</strong> (prefer external routes)</li>
                            <li><strong>Lowest IGP metric</strong> to NEXT_HOP</li>
                            <li><strong>Oldest route</strong> (stability)</li>
                            <li><strong>Lowest router ID</strong> (tie-breaker)</li>
                        </ol>
                        <p><strong>Mnemonic:</strong> "We Love Oranges AS Origin Means External Neighbors Offer Routing"</p>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "You have two paths to reach a network. Path A: AS_PATH = 100, 200, 300. Path B: AS_PATH = 400, 500. Both have same LOCAL_PREF. Which path is selected and why?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <p>Path B is selected because it has a shorter AS_PATH (2 ASes vs 3 ASes). Shortest AS_PATH is evaluated at step 4 of best path selection algorithm.</p>
                        <p><strong>Follow-up:</strong> "What if you wanted to force Path A?"</p>
                        <ul>
                            <li>Increase LOCAL_PREF for Path A (evaluated before AS_PATH)</li>
                            <li>Or decrease WEIGHT for Path B (Cisco-specific, evaluated first)</li>
                            <li>Or use AS_PATH prepending on Path B to make it artificially longer</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔒 BGP Security & Issues</h3>
                    
                    <div class="theory">
                        <div class="theory-title">BGP Hijacking</div>
                        <p><strong>Problem:</strong> BGP trusts all announcements by default</p>
                        <p><strong>Attack:</strong> Malicious AS announces routes for IP space it doesn't own</p>
                        <p><strong>Impact:</strong> Traffic redirected, black-holed, or intercepted</p>
                        
                        <p><strong>Famous incidents:</strong></p>
                        <ul>
                            <li>2008: Pakistan hijacked YouTube IP space (attempted censorship)</li>
                            <li>2018: Amazon DNS hijacked for cryptocurrency theft</li>
                        </ul>

                        <p><strong>Mitigation:</strong></p>
                        <ul>
                            <li><strong>IRR (Internet Routing Registry):</strong> Document authorized routes</li>
                            <li><strong>RPKI (Resource Public Key Infrastructure):</strong> Cryptographic validation</li>
                            <li><strong>ROA (Route Origin Authorization):</strong> Specify which AS can originate prefix</li>
                            <li><strong>BGP Monitoring:</strong> Alert on unexpected route changes</li>
                            <li><strong>Prefix filtering:</strong> Only accept expected prefixes from peers</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Explain how BGP prevents routing loops."</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ul>
                            <li><strong>AS_PATH attribute:</strong> Full list of ASes route has traversed</li>
                            <li>When router receives UPDATE, it checks AS_PATH</li>
                            <li>If router's own AS number is in AS_PATH, discard route (loop detected)</li>
                            <li>This is why BGP is called "path vector" protocol</li>
                            <li><strong>Split horizon:</strong> Don't advertise routes back to peer you learned them from (iBGP)</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔄 OSPF (Open Shortest Path First)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">OSPF Overview</div>
                        <p><strong>Type:</strong> Link-state IGP (Interior Gateway Protocol)</p>
                        <p><strong>Used for:</strong> Routing within an AS (not between ASes like BGP)</p>
                        
                        <p><strong>Key characteristics:</strong></p>
                        <ul>
                            <li><strong>Algorithm:</strong> Dijkstra's SPF (Shortest Path First)</li>
                            <li><strong>Metric:</strong> Cost (based on bandwidth)</li>
                            <li><strong>Fast convergence:</strong> Quickly adapts to topology changes</li>
                            <li><strong>Hierarchical:</strong> Areas to reduce overhead</li>
                            <li><strong>Protocol:</strong> IP protocol 89 (not TCP/UDP)</li>
                        </ul>

                        <p><strong>OSPF Areas:</strong></p>
                        <ul>
                            <li><strong>Area 0 (Backbone):</strong> All areas must connect to Area 0</li>
                            <li><strong>Regular areas:</strong> Connect to backbone via ABR (Area Border Router)</li>
                            <li><strong>Stub areas:</strong> No external routes, only default route</li>
                        </ul>
                    </div>

                    <div class="diagram">
OSPF Hierarchical Design:

        [Area 1]----[ABR]----[Area 0]----[ABR]----[Area 2]
          |                   (Backbone)              |
        Internal             [ABR]                  Internal
        Routers                |                    Routers
                            [Area 3]

ABR = Area Border Router (connects areas)
ASBR = Autonomous System Boundary Router (connects to other ASes)

OSPF Neighbor States:
Down → Init → 2-Way → ExStart → Exchange → Loading → Full
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Compare BGP and OSPF."</strong></p>
                        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Aspect</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">BGP</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">OSPF</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Type</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">EGP (Exterior)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">IGP (Interior)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Algorithm</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Path Vector</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Link State (SPF)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Metric</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Policy-based (attributes)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Cost (bandwidth)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Convergence</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Slow (minutes)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Fast (seconds)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Transport</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">TCP (179)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">IP protocol 89</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Scale</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Internet-scale</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Single organization</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Loop Prevention</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">AS_PATH</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">SPF algorithm</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📋 BGP vs OSPF: When to Use Which?</h3>
                    
                    <div class="pro-con">
                        <div class="pros">
                            <h4>Use BGP when:</h4>
                            <ul>
                                <li>Connecting to Internet (required)</li>
                                <li>Multi-homing (multiple ISP connections)</li>
                                <li>Large scale (thousands of routes)</li>
                                <li>Policy-based routing needed</li>
                                <li>AS-to-AS communication</li>
                                <li>Need route manipulation (AS_PATH prepending, communities)</li>
                            </ul>
                        </div>
                        <div class="cons">
                            <h4>Use OSPF when:</h4>
                            <ul>
                                <li>Internal network routing</li>
                                <li>Fast convergence required</li>
                                <li>Automatic route selection by metrics</li>
                                <li>Single administrative domain</li>
                                <li>Need hierarchical design (areas)</li>
                                <li>Cost-based path selection</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🎯 Building Scalable Networks</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Design Principles</div>
                        
                        <h4>1. Hierarchical Design</h4>
                        <ul>
                            <li><strong>Core layer:</strong> High-speed backbone, no packet manipulation</li>
                            <li><strong>Distribution layer:</strong> Routing, filtering, policy enforcement</li>
                            <li><strong>Access layer:</strong> End-user connectivity</li>
                        </ul>

                        <h4>2. Redundancy</h4>
                        <ul>
                            <li>Multiple paths between critical points</li>
                            <li>No single point of failure</li>
                            <li>Active-active or active-standby</li>
                        </ul>

                        <h4>3. Route Aggregation</h4>
                        <ul>
                            <li>Summarize multiple routes into one</li>
                            <li>Reduces routing table size</li>
                            <li>Faster convergence</li>
                            <li>Example: 192.168.0.0/24 + 192.168.1.0/24 → 192.168.0.0/23</li>
                        </ul>

                        <h4>4. Load Balancing</h4>
                        <ul>
                            <li>ECMP (Equal-Cost Multi-Path): Use multiple equal-cost paths</li>
                            <li>Distribute traffic across links</li>
                            <li>Increase throughput and redundancy</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Design a scalable network for a company with 10,000 employees across 5 office locations."</strong></p>
                        <p><strong>Answer (sample approach):</strong></p>
                        <ol>
                            <li><strong>Core:</strong>
                                <ul>
                                    <li>High-capacity routers connecting all locations</li>
                                    <li>Run BGP between sites (separate ASes) or iBGP</li>
                                    <li>Redundant links with load balancing</li>
                                </ul>
                            </li>
                            <li><strong>Distribution (per site):</strong>
                                <ul>
                                    <li>Layer 3 switches</li>
                                    <li>Run OSPF within each site</li>
                                    <li>VLAN segmentation by department</li>
                                    <li>ACLs and firewall policies</li>
                                </ul>
                            </li>
                            <li><strong>Access:</strong>
                                <ul>
                                    <li>Layer 2 switches</li>
                                    <li>PoE for IP phones/cameras</li>
                                    <li>802.1X authentication</li>
                                </ul>
                            </li>
                            <li><strong>IP Addressing:</strong>
                                <ul>
                                    <li>Site 1: 10.1.0.0/16</li>
                                    <li>Site 2: 10.2.0.0/16</li>
                                    <li>etc., with /24 subnets per department</li>
                                </ul>
                            </li>
                            <li><strong>Redundancy:</strong>
                                <ul>
                                    <li>Dual ISP connections (BGP multi-homing)</li>
                                    <li>HSRP/VRRP for gateway redundancy</li>
                                    <li>Redundant core switches per site</li>
                                </ul>
                            </li>
                            <li><strong>Monitoring:</strong>
                                <ul>
                                    <li>NetFlow/sFlow for traffic analysis</li>
                                    <li>SNMP monitoring</li>
                                    <li>Syslog centralized logging</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>✅ Module Checklist</h3>
                    <ul class="checklist">
                        <li>I can explain BGP's purpose and how it differs from OSPF</li>
                        <li>I can list and explain the 4 BGP message types</li>
                        <li>I can recite the BGP best path selection algorithm in order</li>
                        <li>I understand BGP attributes (LOCAL_PREF, AS_PATH, MED, etc.)</li>
                        <li>I can explain how BGP prevents loops (AS_PATH)</li>
                        <li>I can discuss BGP security issues and mitigations</li>
                        <li>I understand OSPF basics and when to use it vs BGP</li>
                        <li>I can design a scalable network with redundancy</li>
                    </ul>
                </div>
            </div>
        `
    },

    'packet-flow': {
        title: "Complete Packet Flow Journey",
        content: `
            <div class="section">
                <h2 class="section-title">📡 Complete Packet Flow Journey</h2>
                
                <div class="subsection">
                    <h3>🎬 Scenario: User Types "facebook.com" in Browser</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Complete End-to-End Flow</div>
                        <p><strong>Let's trace every step from browser to server and back!</strong></p>
                    </div>

                    <div class="diagram">
High-Level Overview:

[User's Computer] → [Home Router/NAT] → [ISP] → [Internet Backbone] → [Facebook Servers]

Layers involved at each hop:
User PC:        L7 → L6 → L5 → L4 → L3 → L2 → L1
Home Router:              L4 → L3 → L2 → L1
ISP Router:                   L3 → L2 → L1
Backbone:                     L3 → L2 → L1
FB Edge:                      L3 → L2 → L1
FB Server:      L7 → L6 → L5 → L4 → L3 → L2 → L1
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 1: DNS Resolution</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Before connecting, need IP address!</div>
                        <ol>
                            <li><strong>Browser checks cache:</strong> Has it resolved facebook.com recently?
                                <ul><li>Browser cache → OS cache → Not found</li></ul>
                            </li>
                            <li><strong>Check /etc/hosts:</strong> Any manual entries? No</li>
                            <li><strong>Query DNS resolver:</strong>
                                <ul>
                                    <li>Browser reads /etc/resolv.conf for DNS server (e.g., 192.168.1.1)</li>
                                    <li>Sends DNS query (UDP port 53) to resolver</li>
                                </ul>
                            </li>
                            <li><strong>DNS Resolution Process:</strong>
                                <ul>
                                    <li>Resolver checks its cache - miss</li>
                                    <li>Queries root server (.) → "Try .com servers"</li>
                                    <li>Queries .com TLD server → "Try ns1.facebook.com"</li>
                                    <li>Queries facebook.com nameserver → "157.240.241.35"</li>
                                </ul>
                            </li>
                            <li><strong>Response returns:</strong> facebook.com = 157.240.241.35 (A record)</li>
                            <li><strong>Cache it:</strong> Browser and OS cache the result (TTL: 300 seconds)</li>
                        </ol>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Watch DNS in Action</div>
                        <div class="command-box">
<code># Trace full DNS resolution
dig +trace facebook.com

# Time DNS query
time dig facebook.com

# Query with specific DNS server
dig @8.8.8.8 facebook.com

# See the full query/response
dig facebook.com +all</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 2: TCP Connection Setup (3-Way Handshake)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Browser initiates HTTPS connection</div>
                        
                        <h4>Layer 7 (Application):</h4>
                        <ul>
                            <li>Browser decides to connect to 157.240.241.35:443 (HTTPS)</li>
                            <li>Creates HTTP request (will be encrypted with TLS)</li>
                        </ul>

                        <h4>Layer 4 (Transport):</h4>
                        <ul>
                            <li>OS creates TCP segment with:
                                <ul>
                                    <li>Source port: ephemeral (e.g., 54321)</li>
                                    <li>Dest port: 443</li>
                                    <li>Flags: SYN</li>
                                    <li>Sequence number: random (e.g., 1000)</li>
                                </ul>
                            </li>
                        </ul>

                        <h4>Layer 3 (Network):</h4>
                        <ul>
                            <li>OS creates IP packet with:
                                <ul>
                                    <li>Source IP: 192.168.1.100 (your local IP)</li>
                                    <li>Dest IP: 157.240.241.35</li>
                                    <li>Protocol: TCP (6)</li>
                                    <li>TTL: 64</li>
                                </ul>
                            </li>
                            <li>OS checks routing table: Destination not local, use default gateway</li>
                        </ul>

                        <h4>Layer 2 (Data Link):</h4>
                        <ul>
                            <li>Need MAC address of default gateway (192.168.1.1)</li>
                            <li>Check ARP cache - if not found, send ARP request</li>
                            <li>Create Ethernet frame:
                                <ul>
                                    <li>Source MAC: aa:bb:cc:dd:ee:ff (your NIC)</li>
                                    <li>Dest MAC: 11:22:33:44:55:66 (gateway MAC)</li>
                                    <li>EtherType: 0x0800 (IPv4)</li>
                                </ul>
                            </li>
                        </ul>

                        <h4>Layer 1 (Physical):</h4>
                        <ul>
                            <li>Convert frame to electrical signals (Ethernet) or radio waves (WiFi)</li>
                            <li>Transmit on the wire/air</li>
                        </ul>
                    </div>

                    <div class="diagram">
Packet Structure (SYN packet):

┌─────────────────────────────────────────────────┐
│         Ethernet Frame (Layer 2)                │
│  Dest MAC: 11:22:33:44:55:66 (gateway)         │
│  Src MAC:  aa:bb:cc:dd:ee:ff (your PC)         │
│  Type: 0x0800 (IPv4)                           │
│ ┌───────────────────────────────────────────┐  │
│ │      IP Packet (Layer 3)                  │  │
│ │  Src IP: 192.168.1.100                    │  │
│ │  Dst IP: 157.240.241.35                   │  │
│ │  Protocol: 6 (TCP)                        │  │
│ │  TTL: 64                                  │  │
│ │ ┌─────────────────────────────────────┐   │  │
│ │ │   TCP Segment (Layer 4)             │   │  │
│ │ │  Src Port: 54321                    │   │  │
│ │ │  Dst Port: 443                      │   │  │
│ │ │  Flags: SYN                         │   │  │
│ │ │  Seq: 1000                          │   │  │
│ │ │ ┌───────────────────────────────┐   │   │  │
│ │ │ │  Application Data (Layer 7)   │   │  │  │
│ │ │ │  (empty for SYN packet)       │   │  │  │
│ │ │ └───────────────────────────────┘   │   │  │
│ │ └─────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 3: Through the Network (Routing)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Journey Through Routers</div>
                        
                        <h4>At Home Router (192.168.1.1):</h4>
                        <ol>
                            <li><strong>Receives frame:</strong> Dest MAC matches → strip Ethernet header</li>
                            <li><strong>NAT Translation:</strong>
                                <ul>
                                    <li>Original: 192.168.1.100:54321 → 157.240.241.35:443</li>
                                    <li>Translated: 203.0.113.5:10000 → 157.240.241.35:443</li>
                                    <li>Store in NAT table for return traffic</li>
                                </ul>
                            </li>
                            <li><strong>Routing decision:</strong> Check routing table → send to ISP</li>
                            <li><strong>Decrement TTL:</strong> 64 → 63</li>
                            <li><strong>New Ethernet frame:</strong>
                                <ul>
                                    <li>Dest MAC: ISP router MAC</li>
                                    <li>Src MAC: Home router WAN MAC</li>
                                </ul>
                            </li>
                            <li><strong>Forward:</strong> Send to ISP</li>
                        </ol>

                        <h4>At ISP Router(s):</h4>
                        <ol>
                            <li>Strip Layer 2, examine Layer 3</li>
                            <li>Lookup destination in routing table (BGP/IGP routes)</li>
                            <li>Decrement TTL (63 → 62 → 61...)</li>
                            <li>Create new Layer 2 frame for next hop</li>
                            <li>Forward (repeat for each router)</li>
                        </ol>

                        <h4>At Facebook Edge Router:</h4>
                        <ol>
                            <li>Recognize destination IP belongs to them</li>
                            <li>Route to appropriate server via internal network</li>
                            <li>May go through load balancer first</li>
                        </ol>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Trace the Route</div>
                        <div class="command-box">
<code># Trace route to destination
traceroute facebook.com
mtr facebook.com  # Better, real-time view

# See routing decision at each hop
traceroute -I facebook.com  # Use ICMP
traceroute -T -p 443 facebook.com  # Use TCP to port 443

# Watch TTL in action
ping -t 1 8.8.8.8  # TTL=1, should get "Time Exceeded" from first hop
ping -t 2 8.8.8.8  # TTL=2, reaches second hop

# View local routing table
netstat -nr
ip route show</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 4: At Destination Server</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Server Receives and Processes</div>
                        
                        <h4>Layer 1-2: Physical & Data Link</h4>
                        <ul>
                            <li>NIC receives frame, checks dest MAC (matches)</li>
                            <li>Verify checksum (CRC), strip Ethernet header</li>
                            <li>Pass IP packet to OS</li>
                        </ul>

                        <h4>Layer 3: Network</h4>
                        <ul>
                            <li>OS receives IP packet, verifies checksum</li>
                            <li>Checks dest IP (157.240.241.35) - matches local IP</li>
                            <li>Looks at protocol field: 6 (TCP)</li>
                            <li>Strip IP header, pass TCP segment to TCP stack</li>
                        </ul>

                        <h4>Layer 4: Transport</h4>
                        <ul>
                            <li>TCP stack receives segment</li>
                            <li>Checks dest port: 443</li>
                            <li>Sees SYN flag - new connection request!</li>
                            <li>Allocates resources for connection</li>
                            <li><strong>Sends SYN-ACK:</strong>
                                <ul>
                                    <li>SEQ = 5000 (server's initial SEQ)</li>
                                    <li>ACK = 1001 (client's SEQ + 1)</li>
                                    <li>Window size = 65535 (buffer space)</li>
                                </ul>
                            </li>
                        </ul>

                        <h4>Return Journey (SYN-ACK):</h4>
                        <ul>
                            <li>Same process in reverse</li>
                            <li>At client's NAT: Lookup 203.0.113.5:10000 in table → translate back to 192.168.1.100:54321</li>
                            <li>Client receives SYN-ACK, sends final ACK</li>
                            <li><strong>Connection established!</strong></li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 5: TLS Handshake (for HTTPS)</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Secure the Connection</div>
                        <p>After TCP handshake, before HTTP data:</p>
                        <ol>
                            <li><strong>ClientHello:</strong> Supported ciphers, TLS version</li>
                            <li><strong>ServerHello:</strong> Chosen cipher, certificate</li>
                            <li><strong>Certificate validation:</strong> Client verifies server's cert with CA</li>
                            <li><strong>Key exchange:</strong> Establish shared encryption keys</li>
                            <li><strong>Finished:</strong> Both sides confirm encryption ready</li>
                        </ol>
                        <p>Now can send encrypted HTTP requests!</p>
                    </div>
                </div>

                <div class="subsection">
                    <h3>Step 6: HTTP Request/Response</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Finally, the Application Data!</div>
                        
                        <h4>Client sends HTTP request:</h4>
                        <div class="command-box">
<code>GET / HTTP/1.1
Host: facebook.com
User-Agent: Chrome/120.0.0.0
Accept: text/html
...</code>
                        </div>

                        <h4>Server processes and responds:</h4>
                        <div class="command-box">
<code>HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 45232
...

<!DOCTYPE html>
<html>
...</code>
                        </div>

                        <p><strong>Large responses:</strong></p>
                        <ul>
                            <li>Data split into multiple TCP segments</li>
                            <li>Each segment goes through same Layer 4 → 1 process</li>
                            <li>TCP handles reordering at destination</li>
                            <li>TCP flow control prevents overwhelming receiver</li>
                            <li>TCP congestion control prevents network congestion</li>
                        </ul>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Capture Full Flow</div>
                        <div class="command-box">
<code># Capture complete transaction
sudo tcpdump -i any -w facebook.pcap 'host facebook.com'
# In another terminal:
curl https://facebook.com
# Stop tcpdump, analyze in Wireshark

# Watch in real-time
sudo tcpdump -i any -nn -vv 'host facebook.com'

# Or use ngrep to see HTTP content
sudo ngrep -q -W byline 'facebook.com'</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📊 Complete Layer-by-Layer Breakdown</h3>
                    
                    <div class="diagram">
Complete Packet Journey - Layer by Layer:

┌──────────────────────────────────────────────────────────────┐
│ LAYER 7: APPLICATION                                         │
│ - User types facebook.com                                    │
│ - Browser creates HTTP request                               │
│ - TLS encrypts the data                                      │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 4: TRANSPORT (TCP)                                     │
│ - Add TCP header (ports, SEQ, ACK, flags)                    │
│ - 3-way handshake (SYN, SYN-ACK, ACK)                       │
│ - Segment data if too large                                  │
│ - Flow control & congestion control                          │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 3: NETWORK (IP)                                        │
│ - Add IP header (source IP, dest IP, TTL, protocol)         │
│ - Routing decision (check routing table)                     │
│ - Fragment if needed (MTU)                                   │
│ - At each router: decrement TTL, routing lookup, forward     │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 2: DATA LINK (Ethernet/WiFi)                          │
│ - ARP to get MAC address                                     │
│ - Add Ethernet/WiFi header (source MAC, dest MAC)           │
│ - Add trailer with CRC for error detection                  │
│ - At each hop: strip L2, check routing, new L2 for next hop │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 1: PHYSICAL                                            │
│ - Convert to electrical signals (Ethernet cable)             │
│ - Or radio waves (WiFi)                                      │
│ - Or light pulses (fiber optic)                              │
│ - Transmission on the medium                                 │
└──────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-question">
                    <div class="question-title">💬 Interview Question</div>
                    <p><strong>Q: "Walk me through what happens when you ping 8.8.8.8"</strong></p>
                    <p><strong>Complete answer:</strong></p>
                    <ol>
                        <li><strong>Application:</strong> Ping command creates ICMP Echo Request</li>
                        <li><strong>Transport:</strong> ICMP doesn't use TCP/UDP, goes direct to IP</li>
                        <li><strong>Network:</strong>
                            <ul>
                                <li>OS creates IP packet (src: my IP, dst: 8.8.8.8, protocol: ICMP)</li>
                                <li>Check routing table: not local → use default gateway</li>
                            </ul>
                        </li>
                        <li><strong>Data Link:</strong>
                            <ul>
                                <li>Need gateway MAC address</li>
                                <li>Check ARP cache, if not found → ARP request/reply</li>
                                <li>Create Ethernet frame with gateway MAC</li>
                            </ul>
                        </li>
                        <li><strong>Physical:</strong> Transmit on wire/WiFi</li>
                        <li><strong>At Gateway:</strong>
                            <ul>
                                <li>Strip L2, examine L3</li>
                                <li>NAT translation (if applicable)</li>
                                <li>Route lookup, decrement TTL</li>
                                <li>New L2 frame, forward to next hop</li>
                            </ul>
                        </li>
                        <li><strong>Repeat through ISP routers</strong> until reaching 8.8.8.8</li>
                        <li><strong>At 8.8.8.8 (Google DNS):</strong>
                            <ul>
                                <li>Receives ICMP Echo Request</li>
                                <li>Creates ICMP Echo Reply</li>
                                <li>Sends back through same process (reverse path)</li>
                            </ul>
                        </li>
                        <li><strong>Return journey:</strong>
                            <ul>
                                <li>Each router does routing lookup</li>
                                <li>At my gateway: NAT reverse translation</li>
                                <li>Deliver to my PC</li>
                            </ul>
                        </li>
                        <li><strong>Result:</strong> Ping displays RTT (Round Trip Time)</li>
                    </ol>
                </div>

                <div class="subsection">
                    <h3>✅ Module Checklist</h3>
                    <ul class="checklist">
                        <li>I can explain complete packet flow from browser to server</li>
                        <li>I understand what happens at each OSI layer</li>
                        <li>I can explain DNS resolution process</li>
                        <li>I can describe how NAT works in the flow</li>
                        <li>I understand packet encapsulation/decapsulation</li>
                        <li>I can explain what routers do at each hop</li>
                        <li>I practiced packet capture with tcpdump</li>
                        <li>I can answer "what happens when you type URL" question</li>
                    </ul>
                </div>
            </div>
        `
    },

    troubleshooting: {
        title: "Linux Network Troubleshooting",
        content: `
            <div class="section">
                <h2 class="section-title">🔧 Linux Network Troubleshooting</h2>
                
                <div class="subsection">
                    <h3>🎯 Systematic Troubleshooting Approach</h3>
                    
                    <div class="theory">
                        <div class="theory-title">The OSI Model Approach</div>
                        <p><strong>Work bottom-up or top-down:</strong></p>
                        
                        <h4>Bottom-up (Physical → Application):</h4>
                        <ol>
                            <li>Physical: Cable plugged in? Link light on?</li>
                            <li>Data Link: Is interface up? Any errors?</li>
                            <li>Network: Can ping gateway? Correct IP/subnet?</li>
                            <li>Transport: Are ports listening? Firewall rules?</li>
                            <li>Application: Is service running? Config correct?</li>
                        </ol>

                        <h4>Top-down (Application → Physical):</h4>
                        <ul>
                            <li>Good when specific application not working</li>
                            <li>Check app logs → network connectivity → lower layers</li>
                        </ul>

                        <h4>Divide and Conquer:</h4>
                        <ul>
                            <li>Test middle layer (e.g., Network layer)</li>
                            <li>If works, problem is above; if fails, problem is below</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🏓 ping - Basic Connectivity</h3>
                    
                    <div class="theory">
                        <div class="theory-title">What ping tests</div>
                        <ul>
                            <li><strong>Reachability:</strong> Can you reach the host?</li>
                            <li><strong>Latency:</strong> How long does it take?</li>
                            <li><strong>Packet loss:</strong> Are packets being dropped?</li>
                            <li><strong>Uses ICMP:</strong> Echo Request/Reply (not TCP/UDP)</li>
                        </ul>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Ping Commands</div>
                        <div class="command-box">
<code># Basic ping
ping google.com

# Limit count
ping -c 5 google.com

# Flood ping (requires sudo, test network capacity)
sudo ping -f 8.8.8.8

# Set packet size (test MTU)
ping -s 1472 google.com  # 1472 + 28 (IP+ICMP) = 1500 MTU
ping -s 9000 google.com  # If fails, MTU issue

# Don't fragment (test MTU problems)
ping -D -s 1472 google.com

# Set interval
ping -i 0.2 google.com  # Every 0.2 seconds

# IPv6 ping
ping6 google.com

# Ping specific interface
ping -I en0 google.com

# Set TTL
ping -t 1 8.8.8.8  # Should timeout at first hop

# Audible ping
ping -a google.com  # Beep on each reply</code>
                        </div>
                        
                        <p><strong>Interpreting results:</strong></p>
                        <ul>
                            <li><strong>Reply received:</strong> Layer 1-3 working</li>
                            <li><strong>Destination Host Unreachable:</strong> No route to host</li>
                            <li><strong>Request timeout:</strong> Host down, firewall blocking, or network issue</li>
                            <li><strong>Time Exceeded:</strong> TTL reached 0 (routing loop?)</li>
                            <li><strong>High latency:</strong> Network congestion or routing issue</li>
                            <li><strong>Packet loss:</strong> Network congestion, faulty hardware</li>
                        </ul>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Ping to google.com works but SSH doesn't. What's wrong?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ul>
                            <li>Ping uses ICMP, SSH uses TCP port 22</li>
                            <li><strong>Possibilities:</strong>
                                <ol>
                                    <li>Firewall blocking TCP port 22 (but allows ICMP)</li>
                                    <li>SSH service not running on target</li>
                                    <li>Routing asymmetry (ICMP takes different path than TCP)</li>
                                    <li>MTU mismatch (ping small packets work, SSH data doesn't)</li>
                                </ol>
                            </li>
                            <li><strong>Debug:</strong>
                                <ul>
                                    <li><code>telnet google.com 22</code> - does TCP connection work?</li>
                                    <li><code>ssh -vvv google.com</code> - verbose SSH output</li>
                                    <li><code>sudo tcpdump -i any 'port 22'</code> - see packets</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🗺️ traceroute / mtr - Path Tracing</h3>
                    
                    <div class="theory">
                        <div class="theory-title">What traceroute does</div>
                        <ul>
                            <li>Shows path packets take to destination</li>
                            <li>Uses TTL to discover each hop</li>
                            <li>Identifies where packets are being delayed or dropped</li>
                        </ul>
                        
                        <p><strong>How it works:</strong></p>
                        <ol>
                            <li>Send packet with TTL=1 → first router returns "Time Exceeded"</li>
                            <li>Send packet with TTL=2 → second router returns "Time Exceeded"</li>
                            <li>Continue until reaching destination</li>
                        </ol>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 Traceroute Commands</div>
                        <div class="command-box">
<code># Basic traceroute
traceroute google.com

# Use ICMP instead of UDP (more likely to pass firewalls)
traceroute -I google.com

# Use TCP SYN packets (to specific port)
sudo traceroute -T -p 443 google.com

# Set max hops
traceroute -m 20 google.com

# Set number of queries per hop
traceroute -q 1 google.com

# MTR (My Traceroute) - better than traceroute!
mtr google.com           # Interactive, real-time
mtr -r -c 100 google.com # Report mode, 100 cycles

# MTR with TCP
mtr -T -P 443 google.com</code>
                        </div>

                        <p><strong>Reading traceroute output:</strong></p>
                        <div class="command-box">
<code>1  router.local (192.168.1.1)  1.234 ms  1.123 ms  1.056 ms
2  10.0.0.1 (10.0.0.1)  5.678 ms  5.543 ms  5.432 ms
3  * * *
4  google.com (172.217.164.46)  15.234 ms  15.123 ms  15.098 ms

Interpretation:
- Hop 1: Local router, ~1ms latency (good)
- Hop 2: ISP router, ~5ms latency (good)
- Hop 3: * * * = timeout (router not responding to probes, may be configured this way)
- Hop 4: Reached destination, ~15ms latency</code>
                        </div>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">💬 Interview Question</div>
                        <p><strong>Q: "Users report slow connection. Traceroute shows high latency at hop 7. What next?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ol>
                            <li><strong>Confirm issue is consistent:</strong>
                                <ul>
                                    <li>Run mtr for longer period</li>
                                    <li>Check if packet loss at that hop</li>
                                    <li>Test multiple destinations</li>
                                </ul>
                            </li>
                            <li><strong>Identify the hop:</strong>
                                <ul>
                                    <li>Which network does it belong to? (ISP, backbone, etc.)</li>
                                    <li>Contact network owner if external</li>
                                </ul>
                            </li>
                            <li><strong>Check if latency propagates:</strong>
                                <ul>
                                    <li>If all hops after hop 7 also show high latency → hop 7 is bottleneck</li>
                                    <li>If only hop 7 shows latency, next hops normal → may be ICMP deprioritization</li>
                                </ul>
                            </li>
                            <li><strong>Alternative paths:</strong>
                                <ul>
                                    <li>Check if routing can be changed</li>
                                    <li>BGP path manipulation if under your control</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔌 netstat / ss - Socket Statistics</h3>
                    
                    <div class="theory">
                        <div class="theory-title">What netstat/ss show</div>
                        <ul>
                            <li><strong>Active connections:</strong> What's connected to what</li>
                            <li><strong>Listening ports:</strong> What services are waiting for connections</li>
                            <li><strong>Connection states:</strong> ESTABLISHED, TIME_WAIT, LISTEN, etc.</li>
                            <li><strong>Network statistics:</strong> Packets sent/received, errors</li>
                        </ul>
                        <p><strong>Note:</strong> ss is newer and faster than netstat (use ss when available)</p>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 netstat / ss Commands</div>
                        <div class="command-box">
<code># Show all connections and listening ports
netstat -an
ss -tan

# Show listening ports with process info
sudo netstat -tlnp  # TCP listening, numeric, program
sudo ss -tlnp

# Show established connections
netstat -an | grep ESTABLISHED
ss -tan state established

# Show connections to specific port
netstat -an | grep :80
ss -tan '( dport = :80 or sport = :80 )'

# Show statistics
netstat -s  # All protocol statistics
ss -s       # Socket statistics summary

# Show routing table
netstat -nr
ip route show

# Show interface statistics
netstat -i
ip -s link

# Monitor connections in real-time
watch -n 1 "netstat -an | grep ESTABLISHED | wc -l"
watch -n 1 "ss -tan | grep ESTAB | wc -l"

# Show TIME_WAIT connections
netstat -an | grep TIME_WAIT
ss -tan state time-wait

# Show with detailed timer info
ss -tanoe

# Show memory usage per socket
ss -tanm</code>
                        </div>

                        <p><strong>Connection States (TCP):</strong></p>
                        <ul>
                            <li><strong>LISTEN:</strong> Server waiting for connections</li>
                            <li><strong>SYN_SENT:</strong> Client sent SYN, waiting for SYN-ACK</li>
                            <li><strong>SYN_RECEIVED:</strong> Server received SYN, sent SYN-ACK, waiting for ACK</li>
                            <li><strong>ESTABLISHED:</strong> Connection active</li>
                            <li><strong>FIN_WAIT_1/2:</strong> Connection closing</li>
                            <li><strong>CLOSE_WAIT:</strong> Remote end closed, local can still send</li>
                            <li><strong>TIME_WAIT:</strong> Connection closed, waiting for stray packets</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📦 tcpdump / Wireshark - Packet Capture</h3>
                    
                    <div class="theory">
                        <div class="theory-title">When to use packet capture</div>
                        <ul>
                            <li>Need to see actual packets on the wire</li>
                            <li>Debugging protocol-level issues</li>
                            <li>Analyzing retransmissions, handshakes, timing</li>
                            <li>Security analysis</li>
                        </ul>
                    </div>

                    <div class="exercise">
                        <div class="exercise-title">🔧 tcpdump Commands</div>
                        <div class="command-box">
<code># Capture on all interfaces
sudo tcpdump -i any

# Capture specific interface
sudo tcpdump -i en0

# Capture specific host
sudo tcpdump host google.com
sudo tcpdump host 8.8.8.8

# Capture specific port
sudo tcpdump port 80
sudo tcpdump 'port 80 or port 443'

# Capture TCP traffic
sudo tcpdump tcp

# Capture SYN packets
sudo tcpdump 'tcp[tcpflags] & tcp-syn != 0'

# Capture specific source/destination
sudo tcpdump src 192.168.1.100
sudo tcpdump dst 8.8.8.8

# Save to file
sudo tcpdump -i any -w capture.pcap

# Read from file
tcpdump -r capture.pcap

# Verbose output
sudo tcpdump -vvv

# Show packet contents (hex + ASCII)
sudo tcpdump -X

# Show packet contents (ASCII only)
sudo tcpdump -A

# Don't resolve hostnames (faster)
sudo tcpdump -nn

# Limit packet count
sudo tcpdump -c 100

# Capture with snaplen (packet size limit)
sudo tcpdump -s 65535  # Full packet
sudo tcpdump -s 0      # Same as above

# Complex filters
sudo tcpdump 'tcp and (port 80 or port 443) and host google.com'
sudo tcpdump 'tcp[13] & 2 != 0'  # Only SYN packets
sudo tcpdump 'ip[2:2] > 1500'    # Large packets (fragmentation)

# Capture HTTP traffic
sudo tcpdump -A 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'</code>
                        </div>

                        <p><strong>Example: Debugging HTTP connection</strong></p>
                        <div class="command-box">
<code># Terminal 1: Start capture
sudo tcpdump -i any -nn -vv 'host example.com' -w http-debug.pcap

# Terminal 2: Make HTTP request
curl -v http://example.com

# Terminal 1: Stop capture (Ctrl+C)
# Open http-debug.pcap in Wireshark

What to look for:
1. DNS query/response
2. TCP 3-way handshake (SYN, SYN-ACK, ACK)
3. HTTP GET request
4. HTTP response
5. TCP teardown (FIN, ACK, FIN, ACK)</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔍 dig / nslookup - DNS Troubleshooting</h3>
                    
                    <div class="exercise">
                        <div class="exercise-title">🔧 DNS Commands (covered in fundamentals)</div>
                        <div class="command-box">
<code># Quick lookup
dig google.com
nslookup google.com

# Trace full resolution
dig +trace google.com

# Query specific DNS server
dig @8.8.8.8 google.com
dig @1.1.1.1 google.com

# Query specific record type
dig google.com MX
dig google.com NS
dig google.com AAAA

# Reverse lookup
dig -x 8.8.8.8

# Short output
dig +short google.com</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🌐 curl / wget - Application Layer Testing</h3>
                    
                    <div class="exercise">
                        <div class="exercise-title">🔧 Testing HTTP/HTTPS</div>
                        <div class="command-box">
<code># Fetch URL
curl https://google.com
wget https://google.com

# Show headers only
curl -I https://google.com

# Verbose output (shows TLS handshake, etc.)
curl -v https://google.com

# Follow redirects
curl -L https://google.com

# Test with specific timeout
curl --connect-timeout 5 --max-time 10 https://google.com

# Test with specific IP (bypass DNS)
curl --resolve google.com:443:142.250.185.46 https://google.com

# Show timing breakdown
curl -w "@curl-format.txt" -o /dev/null -s https://google.com

# Create curl-format.txt:
cat > curl-format.txt << 'EOF'
time_namelookup:  %{time_namelookup}s\n
time_connect:  %{time_connect}s\n
time_appconnect:  %{time_appconnect}s\n
time_pretransfer:  %{time_pretransfer}s\n
time_redirect:  %{time_redirect}s\n
time_starttransfer:  %{time_starttransfer}s\n
time_total:  %{time_total}s\n
EOF

# Test specific SSL/TLS version
curl --tlsv1.2 https://google.com

# Ignore SSL certificate errors (testing only!)
curl -k https://self-signed.badssl.com/</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🛠️ Interface Configuration</h3>
                    
                    <div class="exercise">
                        <div class="exercise-title">🔧 Interface Commands</div>
                        <div class="command-box">
<code># Show all interfaces
ifconfig
ip addr show

# Show specific interface
ifconfig en0
ip addr show en0

# Show interface statistics (errors, drops)
netstat -i
ip -s link

# Bring interface up/down (requires sudo)
sudo ifconfig en0 down
sudo ifconfig en0 up
sudo ip link set en0 down
sudo ip link set en0 up

# Set IP address (requires sudo)
sudo ifconfig en0 192.168.1.100 netmask 255.255.255.0
sudo ip addr add 192.168.1.100/24 dev en0

# Add route (requires sudo)
sudo route add -net 192.168.2.0/24 gw 192.168.1.1
sudo ip route add 192.168.2.0/24 via 192.168.1.1

# View MAC address
ifconfig en0 | grep ether
ip link show en0

# View MTU
ifconfig en0 | grep mtu
ip link show en0 | grep mtu</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>📊 Complete Troubleshooting Scenario</h3>
                    
                    <div class="interview-question">
                        <div class="question-title">💬 Interview Scenario</div>
                        <p><strong>Q: "Users can't reach web server at 10.0.0.50. Walk me through your troubleshooting steps."</strong></p>
                        <p><strong>Systematic approach:</strong></p>
                        
                        <h4>1. Gather Information:</h4>
                        <div class="command-box">
<code># Can we reach it?
ping 10.0.0.50
# If ping fails, continue...

# Is DNS involved?
ping webserver.example.com
# If domain name doesn't resolve, DNS issue
# If resolves but can't reach IP, network/routing issue</code>
                        </div>

                        <h4>2. Check Local Connectivity:</h4>
                        <div class="command-box">
<code># Is our interface up?
ifconfig
ip addr show

# Can we reach our gateway?
ping 10.0.0.1  # Or whatever our gateway is
netstat -nr    # Check default gateway

# Are there any interface errors?
ifconfig | grep errors
ip -s link</code>
                        </div>

                        <h4>3. Check Routing Path:</h4>
                        <div class="command-box">
<code># Where does the connection fail?
traceroute 10.0.0.50
mtr 10.0.0.50

# Check routing table
ip route show
# Is there a route to 10.0.0.0/24?</code>
                        </div>

                        <h4>4. Check Server:</h4>
                        <div class="command-box">
<code># If we can ping but can't access web service...
# Test specific port
telnet 10.0.0.50 80
nc -zv 10.0.0.50 80

# On server, check if service is listening
sudo netstat -tlnp | grep :80
sudo ss -tlnp | grep :80

# Check if service is running
sudo systemctl status nginx  # or apache2, etc.
ps aux | grep nginx</code>
                        </div>

                        <h4>5. Check Firewall:</h4>
                        <div class="command-box">
<code># On server, check firewall rules
sudo iptables -L -n
sudo ufw status

# On client, test with tcpdump
# Terminal 1:
sudo tcpdump -i any 'host 10.0.0.50 and port 80' -nn

# Terminal 2:
curl http://10.0.0.50

# Look for:
# - SYN sent, but no SYN-ACK received? Server firewall blocking
# - SYN sent, SYN-ACK received, but no data? Application issue
# - No SYN sent? Local firewall or routing issue</code>
                        </div>

                        <h4>6. Advanced Checks:</h4>
                        <div class="command-box">
<code># MTU issues?
ping -s 1472 10.0.0.50  # Should work
ping -s 1500 10.0.0.50  # Might fail if MTU problem

# Asymmetric routing?
# Trace path both directions
# On client:
traceroute 10.0.0.50
# On server:
traceroute [client-ip]

# NAT issues?
# Check NAT table on firewall/router

# High packet loss/retransmissions?
netstat -s | grep -i retrans</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>✅ Module Checklist</h3>
                    <ul class="checklist">
                        <li>I know when to use ping vs traceroute vs tcpdump</li>
                        <li>I can interpret ping output and diagnose issues</li>
                        <li>I can use traceroute to identify network bottlenecks</li>
                        <li>I can use netstat/ss to check connections and ports</li>
                        <li>I can capture and analyze packets with tcpdump</li>
                        <li>I can check interface status and configuration</li>
                        <li>I can follow systematic troubleshooting approach</li>
                        <li>I practiced all commands in terminal</li>
                    </ul>
                </div>
            </div>
        `
    },

    scenarios: {
        title: "Interview Scenarios & Mock Questions",
        content: `
            <div class="section">
                <h2 class="section-title">🎤 Interview Scenarios & Mock Questions</h2>
                
                <div class="subsection">
                    <h3>💼 Common Interview Questions</h3>
                    
                    <div class="interview-question">
                        <div class="question-title">Q1: Computer plugged into switch/router setup</div>
                        <p><strong>"You plug a computer into a switch that's connected to a router. What happens? Walk me through all layers."</strong></p>
                        <p><strong>Answer:</strong></p>
                        <ol>
                            <li><strong>Physical Layer (L1):</strong>
                                <ul>
                                    <li>Cable connected, switch detects electrical signal</li>
                                    <li>Link negotiation (speed, duplex) via auto-negotiation</li>
                                    <li>Link LED turns green</li>
                                </ul>
                            </li>
                            <li><strong>Data Link Layer (L2):</strong>
                                <ul>
                                    <li>Computer's NIC has MAC address (burned-in or assigned)</li>
                                    <li>Switch learns MAC address on that port (MAC address table)</li>
                                    <li>Switch forwards frames based on destination MAC</li>
                                </ul>
                            </li>
                            <li><strong>Network Layer (L3):</strong>
                                <ul>
                                    <li>Computer needs IP address - three options:</li>
                                    <li><strong>a) Static configuration:</strong> Manually set IP, netmask, gateway, DNS</li>
                                    <li><strong>b) DHCP:</strong> Computer broadcasts DHCP Discover → receives DHCP Offer → sends DHCP Request → receives DHCP Ack with IP config</li>
                                    <li><strong>c) Link-local:</strong> If no DHCP, assigns 169.254.x.x</li>
                                    <li>Computer adds default route pointing to gateway (router)</li>
                                </ul>
                            </li>
                            <li><strong>To reach another computer on same subnet:</strong>
                                <ul>
                                    <li>ARP request broadcast: "Who has 192.168.1.5?"</li>
                                    <li>Target responds with ARP reply containing MAC address</li>
                                    <li>Switch forwards frames between computers</li>
                                </ul>
                            </li>
                            <li><strong>To reach computer on different subnet:</strong>
                                <ul>
                                    <li>Computer sends packet to default gateway (router)</li>
                                    <li>ARP for router's MAC address if not in cache</li>
                                    <li>Router receives packet, performs routing lookup</li>
                                    <li>Router forwards based on routing table (static or dynamic routing)</li>
                                </ul>
                            </li>
                        </ol>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">Q2: Server Health Checks</div>
                        <p><strong>"How do you implement health checks for a web server cluster?"</strong></p>
                        <p><strong>Answer:</strong></p>
                        
                        <h4>Types of Health Checks:</h4>
                        <ol>
                            <li><strong>Basic HTTP Health Check:</strong>
                                <ul>
                                    <li>Load balancer sends HTTP GET to /health endpoint</li>
                                    <li>Server responds with 200 OK if healthy</li>
                                    <li>Fast but shallow (only checks web server responding)</li>
                                </ul>
                            </li>
                            <li><strong>Deep Health Check:</strong>
                                <ul>
                                    <li>Check database connectivity</li>
                                    <li>Check dependent services availability</li>
                                    <li>Check disk space, memory, CPU</li>
                                    <li>More comprehensive but slower</li>
                                </ul>
                            </li>
                            <li><strong>TCP Health Check:</strong>
                                <ul>
                                    <li>Just verify port is listening (TCP handshake)</li>
                                    <li>Fastest but least informative</li>
                                </ul>
                            </li>
                        </ol>

                        <h4>Implementation Details:</h4>
                        <ul>
                            <li><strong>Interval:</strong> Every 5-30 seconds (balance between detection time and overhead)</li>
                            <li><strong>Timeout:</strong> 2-5 seconds per check</li>
                            <li><strong>Threshold:</strong> Mark unhealthy after 2-3 consecutive failures (avoid flapping)</li>
                            <li><strong>Grace period:</strong> Don't check immediately after server start (warm-up time)</li>
                        </ul>

                        <h4>Load Balancer Behavior:</h4>
                        <ul>
                            <li><strong>Active health check:</strong> LB proactively checks servers</li>
                            <li><strong>Passive health check:</strong> LB monitors actual traffic failures</li>
                            <li><strong>Unhealthy server:</strong> Remove from rotation, stop sending traffic</li>
                            <li><strong>Recovery:</strong> Continue checking, add back when healthy again</li>
                        </ul>

                        <h4>Advanced Techniques:</h4>
                        <ul>
                            <li><strong>Blue-Green Deployment:</strong> Health check on blue environment before switching traffic</li>
                            <li><strong>Canary Deployment:</strong> Send small % of traffic to new version, monitor health</li>
                            <li><strong>Circuit Breaker:</strong> If server repeatedly fails, stop trying for period</li>
                        </ul>

                        <h4>Example Health Check Endpoint:</h4>
                        <div class="command-box">
<code>GET /health HTTP/1.1

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-31T10:30:00Z",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "disk_space": "ok"
  },
  "version": "1.2.3"
}</code>
                        </div>
                    </div>

                    <div class="interview-question">
                        <div class="question-title">Q3: Packet Loss Troubleshooting</div>
                        <p><strong>"Users report intermittent packet loss. How do you troubleshoot?"</strong></p>
                        <p><strong>Systematic Approach:</strong></p>
                        
                        <h4>1. Confirm and Quantify:</h4>
                        <div class="command-box">
<code># Test packet loss
ping -c 1000 [destination]
# Look for: 10% packet loss, 0% packet loss, etc.

# Continuous monitoring
mtr -r -c 1000 [destination] > mtr-report.txt

# Check if loss is consistent or intermittent
watch -n 1 "ping -c 10 [destination] | grep loss"</code>
                        </div>

                        <h4>2. Isolate Location:</h4>
                        <ul>
                            <li><strong>Local network:</strong> Ping gateway - loss here = local issue</li>
                            <li><strong>ISP network:</strong> Traceroute shows loss at ISP hops</li>
                            <li><strong>Destination:</strong> Loss only at final destination</li>
                        </ul>

                        <h4>3. Check Physical Layer:</h4>
                        <div class="command-box">
<code># Interface errors/drops
ifconfig | grep -E "(errors|dropped)"
ip -s link show en0

# Check for:
# - RX errors: Bad packets received (cable, NIC issue)
# - TX errors: Failed transmissions
# - Dropped: Buffer overflow (congestion)</code>
                        </div>

                        <h4>4. Check Network Load:</h4>
                        <div class="command-box">
<code># Bandwidth usage
iftop  # Real-time bandwidth monitoring
nload  # Network load visualization

# Check if interface maxed out
# Gigabit = 1000 Mbps, if consistently near 1000, link saturated</code>
                        </div>

                        <h4>5. Common Causes:</h4>
                        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Symptom</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Likely Cause</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Solution</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">Loss at gateway</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Bad cable, NIC, or switch port</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Replace cable, test different port</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">Loss during high traffic</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Bandwidth saturation</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">QoS, upgrade link, traffic shaping</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">Loss at specific hop</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Router congestion or issue</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Contact network owner, reroute</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">Intermittent loss</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">WiFi interference, duplex mismatch</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Check WiFi channel, fix duplex settings</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">High latency + loss</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Network congestion</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Implement QoS, increase capacity</td>
                            </tr>
                        </table>

                        <h4>6. Advanced Diagnostics:</h4>
                        <div class="command-box">
<code># Check for duplex mismatch (major cause of packet loss!)
ethtool en0 | grep -i duplex
# Should show "Full Duplex" on both ends
# Half/Full mismatch = packet collisions

# Check MTU
ip link show | grep mtu
# MTU mismatch can cause fragmentation issues

# TCP retransmissions (indicates packet loss)
netstat -s | grep -i retrans
ss -ti | grep -i retrans</code>
                        </div>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🏗️ Design Questions</h3>
                    
                    <div class="interview-question">
                        <div class="question-title">Q4: Design a Scalable Network</div>
                        <p><strong>"Design a network for a company with 5000 employees across 3 office locations."</strong></p>
                        
                        <h4>Requirements Gathering:</h4>
                        <ul>
                            <li>Traffic patterns (inter-office, internet, specific applications)</li>
                            <li>Bandwidth requirements</li>
                            <li>Redundancy/availability requirements (99.9%, 99.99%?)</li>
                            <li>Security requirements (segmentation, compliance)</li>
                            <li>Growth projections</li>
                        </ul>

                        <h4>Proposed Design:</h4>
                        
                        <h5>1. Core Layer (Inter-office connectivity):</h5>
                        <ul>
                            <li><strong>MPLS</strong> or <strong>SD-WAN</strong> connecting offices</li>
                            <li>Redundant links (minimum 2 per site)</li>
                            <li>iBGP for route distribution between sites</li>
                            <li>High-capacity routers (10Gbps+ links)</li>
                        </ul>

                        <h5>2. Distribution Layer (per office):</h5>
                        <ul>
                            <li>Layer 3 switches (routing + switching)</li>
                            <li>OSPF within each office for internal routing</li>
                            <li>VLAN segmentation:
                                <ul>
                                    <li>VLAN 10: Management</li>
                                    <li>VLAN 20: Finance</li>
                                    <li>VLAN 30: Engineering</li>
                                    <li>VLAN 40: Guest WiFi (isolated)</li>
                                </ul>
                            </li>
                            <li>ACLs between VLANs</li>
                            <li>HSRP/VRRP for gateway redundancy</li>
                        </ul>

                        <h5>3. Access Layer:</h5>
                        <ul>
                            <li>Layer 2 switches at edge</li>
                            <li>PoE for IP phones, cameras</li>
                            <li>802.1X port-based authentication</li>
                            <li>Storm control, BPDU guard</li>
                        </ul>

                        <h5>4. IP Addressing:</h5>
                        <div class="command-box">
<code>Office 1: 10.1.0.0/16
  - Management:  10.1.1.0/24
  - Finance:     10.1.10.0/23 (512 IPs)
  - Engineering: 10.1.20.0/22 (1024 IPs)
  - Guest:       10.1.100.0/24

Office 2: 10.2.0.0/16
Office 3: 10.3.0.0/16

Route summarization at core:
  - Office 1: 10.1.0.0/16
  - Office 2: 10.2.0.0/16
  - Office 3: 10.3.0.0/16</code>
                        </div>

                        <h5>5. Internet Connectivity:</h5>
                        <ul>
                            <li>Dual ISP per site (BGP multi-homing)</li>
                            <li>Primary/backup or active-active with load balancing</li>
                            <li>NAT at internet edge</li>
                            <li>Firewall (stateful inspection, IDS/IPS)</li>
                        </ul>

                        <h5>6. Services:</h5>
                        <ul>
                            <li>DHCP servers (redundant) per office</li>
                            <li>DNS servers (internal + caching)</li>
                            <li>NTP servers for time sync</li>
                            <li>Syslog/SNMP for centralized logging/monitoring</li>
                        </ul>

                        <h5>7. Security:</h5>
                        <ul>
                            <li>DMZ for public-facing servers</li>
                            <li>VPN for remote users (SSL VPN or IPSec)</li>
                            <li>Network segmentation (prevent lateral movement)</li>
                            <li>DDoS protection at internet edge</li>
                        </ul>

                        <h5>8. Monitoring & Management:</h5>
                        <ul>
                            <li>NetFlow/sFlow for traffic analysis</li>
                            <li>SNMP monitoring (Nagios, Zabbix, etc.)</li>
                            <li>Configuration management (Ansible, etc.)</li>
                            <li>Capacity planning and alerting</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🎓 Protocol Deep Dive Questions</h3>
                    
                    <div class="interview-question">
                        <div class="question-title">Q5: Compare Two Protocols</div>
                        <p><strong>"Compare TCP and UDP. When would you use each?"</strong></p>
                        
                        <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Feature</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">TCP</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">UDP</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Connection</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Connection-oriented</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Connectionless</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Reliability</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Reliable (ACKs, retransmissions)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Unreliable (best-effort)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ordering</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">In-order delivery</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">No ordering guarantee</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Speed</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Slower (overhead)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Faster (no overhead)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Header Size</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">20 bytes minimum</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">8 bytes</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Flow Control</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Yes (sliding window)</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">No</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Congestion Control</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Yes</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">No</td>
                            </tr>
                        </table>

                        <h4>Use TCP when:</h4>
                        <ul>
                            <li>Data integrity critical (file transfer, email, web)</li>
                            <li>Can tolerate latency for reliability</li>
                            <li>Need ordered delivery</li>
                            <li><strong>Examples:</strong> HTTP/HTTPS, FTP, SSH, SMTP</li>
                        </ul>

                        <h4>Use UDP when:</h4>
                        <ul>
                            <li>Speed more important than reliability</li>
                            <li>Can handle some packet loss</li>
                            <li>Real-time applications</li>
                            <li>Small query-response (overhead not worth it)</li>
                            <li><strong>Examples:</strong> DNS, VoIP, video streaming, gaming, DHCP</li>
                        </ul>

                        <h4>Modern Hybrid Approaches:</h4>
                        <ul>
                            <li><strong>QUIC:</strong> UDP-based but with TCP-like reliability</li>
                            <li><strong>RTP:</strong> Real-time transport over UDP with sequence numbers</li>
                            <li><strong>Application-level:</strong> Use UDP for speed, implement custom reliability</li>
                        </ul>
                    </div>
                </div>

                <div class="subsection">
                    <h3>🔥 Rapid Fire Questions</h3>
                    
                    <div class="theory">
                        <div class="theory-title">Practice These!</div>
                        <ol>
                            <li><strong>Q: What port does HTTPS use?</strong> A: 443</li>
                            <li><strong>Q: What's the difference between hub, switch, and router?</strong>
                                <ul>
                                    <li>Hub: L1, broadcasts to all ports</li>
                                    <li>Switch: L2, forwards based on MAC address</li>
                                    <li>Router: L3, forwards based on IP address</li>
                                </ul>
                            </li>
                            <li><strong>Q: What's a broadcast domain vs collision domain?</strong>
                                <ul>
                                    <li>Broadcast domain: Area where broadcast reaches (stopped by routers)</li>
                                    <li>Collision domain: Area where collisions can occur (stopped by switches)</li>
                                </ul>
                            </li>
                            <li><strong>Q: Difference between /24 and /16?</strong>
                                <ul>
                                    <li>/24: 256 addresses (254 usable)</li>
                                    <li>/16: 65,536 addresses (65,534 usable)</li>
                                </ul>
                            </li>
                            <li><strong>Q: What's the default TTL?</strong> A: Typically 64 (Linux) or 128 (Windows)</li>
                            <li><strong>Q: What's MSS?</strong> A: Maximum Segment Size (MTU - IP header - TCP header = 1460 for standard 1500 MTU)</li>
                            <li><strong>Q: What's the purpose of sequence numbers in TCP?</strong> A: Ordering, duplicate detection, ACK which bytes received</li>
                            <li><strong>Q: What layer does ARP operate at?</strong> A: Layer 2.5 (bridges L2 and L3)</li>
                            <li><strong>Q: How does HTTPS provide security?</strong> A: TLS/SSL encryption (confidentiality), certificates (authentication), hashing (integrity)</li>
                            <li><strong>Q: What's a private IP range?</strong> A: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</li>
                        </ol>
                    </div>
                </div>

                <div class="subsection">
                    <h3>✅ Final Checklist</h3>
                    <ul class="checklist">
                        <li>I can walk through computer-switch-router setup at all layers</li>
                        <li>I can explain server health check implementations</li>
                        <li>I can troubleshoot packet loss systematically</li>
                        <li>I can design a scalable multi-site network</li>
                        <li>I can compare TCP vs UDP and explain use cases</li>
                        <li>I can answer rapid fire questions confidently</li>
                        <li>I practiced all scenarios out loud</li>
                        <li>I'm ready for the interview! 💪</li>
                    </ul>
                </div>
            </div>
        `
    }
};

// Module management
let completedModules = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    attachModuleListeners();
    attachChecklistListeners();
});

function loadProgress() {
    const saved = localStorage.getItem('networking-prep-progress');
    if (saved) {
        completedModules = new Set(JSON.parse(saved));
        completedModules.forEach(module => {
            const card = document.querySelector(`[data-module="${module}"]`);
            if (card) card.classList.add('completed');
        });
        updateProgress();
    }
}

function saveProgress() {
    localStorage.setItem('networking-prep-progress', JSON.stringify([...completedModules]));
}

function updateProgress() {
    const total = Object.keys(modules).length;
    const completed = completedModules.size;
    const percentage = Math.round((completed / total) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = percentage + '%';
    progressFill.textContent = percentage + '%';
    progressText.textContent = `${completed} of ${total} modules completed`;
}

function attachModuleListeners() {
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            openModule(moduleId);
        });
    });
}

function openModule(moduleId) {
    const module = modules[moduleId];
    if (!module) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    // Set innerHTML first
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            ${module.content}
            <button class="complete-button" onclick="markComplete('${moduleId}')">
                ${completedModules.has(moduleId) ? 'Completed ✓' : 'Mark as Complete'}
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Now render inline exercises after DOM is ready
    modal.querySelectorAll('.inline-exercise-placeholder').forEach(placeholder => {
        const exerciseId = placeholder.dataset.exercise;
        if (exerciseId && typeof createInlineExercise === 'function') {
            const exerciseElement = createInlineExercise(exerciseId);
            placeholder.replaceWith(exerciseElement);
        }
    });

    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Attach checklist listeners in modal
    attachChecklistListeners();
}

function attachChecklistListeners() {
    document.querySelectorAll('.checklist li').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('checked');
        });
    });
}

function markComplete(moduleId) {
    completedModules.add(moduleId);
    saveProgress();
    updateProgress();
    
    const card = document.querySelector(`[data-module="${moduleId}"]`);
    if (card) card.classList.add('completed');
    
    // Update button
    const button = event.target;
    button.textContent = 'Completed ✓';
    
    // Close modal after brief delay
    setTimeout(() => {
        document.querySelector('.modal').remove();
    }, 500);
}
