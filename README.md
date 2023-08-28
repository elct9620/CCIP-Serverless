# CCIP Serverless

[![Test](https://github.com/elct9620/CCIP-Serverless/actions/workflows/test.yml/badge.svg)](https://github.com/elct9620/CCIP-Serverless/actions/workflows/test.yml) [![CucumberReports: CCIP-App/CCIP-Serverless](https://messages.cucumber.io/api/report-collections/d21a64fa-a180-4742-940e-a2fd885c650a/badge)](https://reports.cucumber.io/report-collections/d21a64fa-a180-4742-940e-a2fd885c650a)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/elct9620/CCIP-Serverless)

A Community Checkin with Interactivity Project Serverless version

## Development

| Path         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `/api`       | The CIPP Server API implementation                           |
| `/mock`      | The mock API for E2E testing                                 |
| `/functions` | The `Functions` for Cloudflare Pages (be used in production) |
| `/worker`    | The Cloudflare Worker API be used in Vite and E2E testing    |
| `/src`       | The Domain Model of CIPP Server                              |
