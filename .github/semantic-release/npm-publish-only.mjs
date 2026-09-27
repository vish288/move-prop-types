// @semantic-release/npm without its addChannel step.
//
// npm trusted publishing (OIDC) authorises `npm publish` only; `npm dist-tag add`
// fails with 401. semantic-release runs addChannel when a maintenance branch
// (for example 1.x) first contains a version that was released from main, which
// broke the first 1.x release. `publish` still sets the branch's dist-tag
// (for example release-1.x), because the tag is part of `npm publish`.
export { verifyConditions, prepare, publish } from '@semantic-release/npm';
