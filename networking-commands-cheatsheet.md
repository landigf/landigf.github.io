# 🚀 Meta Networking Interview - Command Cheatsheet

## Quick Reference for Day-of-Interview

### DNS Testing
```bash
# Basic lookup
dig google.com
nslookup google.com

# Trace full resolution
dig +trace google.com

# Query specific record
dig google.com MX
dig google.com NS
dig google.com AAAA

# Reverse lookup
dig -x 8.8.8.8

# Use specific DNS server
dig @8.8.8.8 google.com
```

### Connectivity Testing
```bash
# Basic ping
ping -c 10 google.com

# Test MTU
ping -s 1472 google.com    # Should work
ping -s 1500 google.com    # Might fail if MTU issue

# Trace route
traceroute google.com
mtr google.com             # Better, real-time

# TCP connectivity test
telnet google.com 80
nc -zv google.com 80
```

### Port & Connection Status
```bash
# Show all listening ports
sudo netstat -tlnp
sudo ss -tlnp

# Show established connections
netstat -an | grep ESTABLISHED
ss -tan state established

# Show TIME_WAIT connections
netstat -an | grep TIME_WAIT
ss -tan state time-wait

# Show specific port
netstat -an | grep :80
ss -tan '( sport = :80 or dport = :80 )'

# Statistics
netstat -s
ss -s
```

### Packet Capture
```bash
# Basic capture
sudo tcpdump -i any

# Capture specific host/port
sudo tcpdump host google.com
sudo tcpdump port 80

# Save to file
sudo tcpdump -i any -w capture.pcap

# Read file
tcpdump -r capture.pcap

# Verbose with no name resolution
sudo tcpdump -nn -vv

# Capture TCP handshake
sudo tcpdump 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' -nn
```

### Interface Status
```bash
# Show interfaces
ifconfig
ip addr show

# Interface statistics
netstat -i
ip -s link

# Check for errors
ifconfig | grep errors
ip -s link show en0
```

### Routing
```bash
# Show routing table
netstat -nr
ip route show

# Show default gateway
ip route | grep default
```

### ARP
```bash
# View ARP cache
arp -a
ip neigh show

# Flush ARP cache
sudo arp -d -a        # macOS
sudo ip neigh flush all   # Linux
```

---

## Key Concepts to Remember

### TCP 3-Way Handshake
1. **SYN**: Client → Server (SEQ=x)
2. **SYN-ACK**: Server → Client (SEQ=y, ACK=x+1)
3. **ACK**: Client → Server (ACK=y+1)

### BGP Best Path Selection (in order)
1. Highest **WEIGHT** (Cisco-specific)
2. Highest **LOCAL_PREF**
3. **Locally originated**
4. Shortest **AS_PATH**
5. Lowest **ORIGIN**
6. Lowest **MED**
7. **eBGP** over iBGP
8. Lowest **IGP metric** to NEXT_HOP
9. **Oldest** route
10. Lowest **router ID**

**Mnemonic**: "We Love Oranges AS Origin Means External Neighbors Offer Routing"

### DHCP DORA Process
1. **Discover**: Client broadcasts "Need IP"
2. **Offer**: DHCP server offers IP
3. **Request**: Client requests the offered IP
4. **Acknowledge**: Server confirms

### Common Ports
- HTTP: 80
- HTTPS: 443
- SSH: 22
- FTP: 21
- SMTP: 25
- DNS: 53
- DHCP: 67/68
- BGP: 179

### Subnetting Quick Reference
```
/24 = 255.255.255.0     = 256 addresses (254 usable)
/25 = 255.255.255.128   = 128 addresses (126 usable)
/26 = 255.255.255.192   = 64 addresses (62 usable)
/27 = 255.255.255.224   = 32 addresses (30 usable)
/28 = 255.255.255.240   = 16 addresses (14 usable)
/30 = 255.255.255.252   = 4 addresses (2 usable) - point-to-point
```

### Private IP Ranges
- 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
- 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
- 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)

---

## Common Interview Questions - Quick Answers

**Q: Ping works but SSH doesn't. Why?**
- Ping = ICMP, SSH = TCP port 22
- Check: firewall blocking port 22, SSH service not running, MTU issues

**Q: High packet retransmissions. Troubleshoot?**
1. `netstat -s | grep retrans` - quantify
2. `mtr destination` - locate where
3. `ifconfig | grep errors` - check interface
4. Common causes: network congestion, bad cable/NIC, MTU mismatch

**Q: BGP vs OSPF?**
- BGP: Between ASes, policy-based, path vector, slow convergence
- OSPF: Within AS, cost-based, link-state, fast convergence

**Q: TCP vs UDP?**
- TCP: Reliable, ordered, connection-oriented, slower (HTTP, SSH, FTP)
- UDP: Fast, unreliable, connectionless (DNS, VoIP, gaming)

**Q: What happens when you type URL in browser?**
1. DNS resolution
2. TCP 3-way handshake
3. TLS handshake (HTTPS)
4. HTTP request
5. Server processes and responds
6. Browser renders

**Q: NAT pros and cons?**
- Pros: Saves IPs, security layer, allows internal redesign
- Cons: Breaks end-to-end, complicates P2P, adds latency

---

## Day-of Tips

1. **Draw diagrams!** Especially for packet flow, handshakes, network design
2. **Think out loud** - explain your reasoning
3. **Ask clarifying questions** before answering
4. **Use systematic approach** for troubleshooting (bottom-up or top-down)
5. **Admit if you don't know** something, then explain how you'd find out
6. **Prepare 2+ protocols to discuss in depth** (pick your strongest!)
7. **Have questions ready** for the interviewer about Meta's network

---

## Practice These Commands RIGHT NOW

Open terminal and run each command to see real output:

```bash
# 1. Check your network setup
ifconfig
ip addr show
netstat -nr

# 2. Test connectivity
ping -c 5 google.com
traceroute google.com

# 3. DNS lookup
dig google.com
dig +trace google.com

# 4. Check what's listening
sudo netstat -tlnp
sudo ss -tlnp

# 5. Capture some packets
sudo tcpdump -i any -c 20 -nn
```

**Good luck! You've got this! 💪🚀**
