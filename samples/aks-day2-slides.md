# AKS Day-2 Operations 🛠️

Keeping clusters reliable, secure, and cost-efficient after go-live.

---

## Agenda 🧭

- Reliability and scaling
- Security and upgrades
- Observability and troubleshooting
- Cost and governance

---

## Reliability Basics ✅

- Use multiple node pools for isolation
- Spread across zones where available
- Set resource requests/limits for critical workloads

---

## Autoscaling 📈

- Enable cluster autoscaler per node pool
- Use HPA for workload scaling
- Right-size requests to avoid overprovisioning

| Layer | Signal | Typical target |
| --- | --- | --- |
| HPA | CPU / RPS | 60-75% utilization |
| Cluster autoscaler | Pending pods | 2-5 min scale out |
| VPA (optional) | Requests drift | Weekly tuning |

---

## Patch and Upgrade Strategy 🧩

- Keep control plane and nodes on supported versions
- Use surge upgrades to reduce downtime
- Test upgrades in non-prod first

---

## Security Hygiene 🔐

- Use Azure AD and RBAC
- Lock down API server with authorized IPs
- Scan images and enforce policies

| Control | Tooling | Cadence |
| --- | --- | --- |
| Image scanning | Defender / Trivy | On build + weekly |
| Policy | Azure Policy / OPA | Continuous |
| Secrets | Key Vault / CSI | Rotate quarterly |

---

## Network Best Practices 🌐

- Use Network Policies for pod isolation
- Limit public load balancers
- Use private cluster for sensitive workloads

---

## Observability 🔭

- Centralize logs with Azure Monitor
- Emit metrics for SLOs
- Alert on error rates, saturation, and latency

| Signal | Example metric | Why it matters |
| --- | --- | --- |
| Latency | p95 response time | User experience |
| Errors | 5xx rate | Reliability |
| Saturation | CPU / memory | Capacity risk |

---

## Backup and Recovery 💾

- Back up ETCD with a defined cadence
- Use Velero for namespace backups
- Practice restore drills

---

## Troubleshooting Playbook 🧰

- Capture `kubectl describe` and events first
- Check node pressure and eviction events
- Correlate deployments with incident time

---

## Cost Management 💸

- Use spot node pools for batch workloads
- Schedule scale-down for dev/test
- Review idle resources monthly

| Opportunity | Action | Typical impact |
| --- | --- | --- |
| Idle nodes | Nightly scale-down | 20-40% savings |
| Oversized pods | Right-size requests | 10-30% savings |
| Non-prod | Use spot pools | 30-60% savings |

---

## Governance 🧾

- Standardize namespaces and quotas
- Enforce policy-as-code
- Use GitOps for drift control

---

## Closing 🎯

- Focus on reliability, security, and efficiency
- Automate routine maintenance
- Measure and improve continuously
