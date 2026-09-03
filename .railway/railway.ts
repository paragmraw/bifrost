import { defineRailway, github, project, service } from "railway/iac";

// Bifrost — Railway Infrastructure as Code (migrated from railway.toml
// Config as Code, which Railway deprecated; unread after 2026-12-01).
// Live state imported with `railway config pull`, then the CaC healthcheck
// intent was re-declared (the dashboard never persisted it — CaC applied it
// per-deployment only). Source is pinned to the GitHub repo without a
// commitSha so autodeploys keep following `main`.
export default defineRailway(() => {
  const bifrost = service("bifrost", {
    source: github("paragmraw/bifrost", { checkSuites: false }),
    // GET / — the same route nginx serves for index.html; also the image
    // HEALTHCHECK and the docker-compose check. From the old railway.toml.
    healthcheck: "/",
    healthcheckTimeout: 60,
    // Stateless static frontend; one replica in Southeast Asia.
    replicas: { "asia-southeast1-eqsg3a": 1 },
    // Imported live settings (dashboard-managed before this migration):
    // IPv6 egress, 8 vCPU / 8 GB limit override, sleep on idle.
    deploy: { ipv6EgressEnabled: true, limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } }, sleepApplication: true },
    domains: ["bifrost.parag.tech"],
  });

  return project("bifrost", {
    resources: [bifrost],
  });
});
