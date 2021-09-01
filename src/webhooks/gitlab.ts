interface Project {
  id: number;
  name: string;
  description: string;
  web_url: string;
  avatar_url: null;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path: null;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

interface Runner {
  active: boolean;
  runner_type: string;
  is_shared: boolean;
  id: number;
  description: string;
  tags: string[];
}

interface Repository {
  name: string;
  url: string;
  description: string;
  homepage: string;
  git_http_url?: string;
  git_ssh_url?: string;
  visibility_level?: number;
}

interface Author {
  name: string;
  email: string;
}

interface Commit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: Author;
  added: Array<string>;
  modified: Array<string>;
  removed: Array<string>;
}

interface User {
  name: string;
  username: string;
  avatar_url: string;
}

interface Source {
  name: string;
  ssh_url: string;
  http_url: string;
  web_url: string;
  namespace: string;
  visibility_level: number;
}

/**
 * 收到push通知时的http body
 */
interface PushEvent {
  object_kind: 'push';
  before: string;
  after: string;
  ref: string;
  checkout_sha: string;
  user_name: string;
  user_id: number;
  user_email: string;
  project_id: number;
  repository: Repository;
  commits: Array<Commit>;
  total_commits_count: number;
}

interface MergeRequestEvent {
  object_kind: 'merge_request';
  user: User;
  object_attributes: {
    // 这里并不包括所有的object_attribute，因为实在太多了暂时只列出我们需要的几个属性
    id: number;
    target_branch: string;
    source_branch: string;
    title: string;
    created_at: string;
    updated_at: string;
    merge_status: string;
    description: string;
    url: string;
    source: Source;
    action: string; // action 可能是open/update/close/reopen
  };
}

interface IssueEvent {
  object_kind: 'issue';
  event_type: 'issue';
  user: User;
  repository: Repository;
  object_attributes: {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    merge_status: string;
    description: string;
    url: string;
    state: string;
    action: string; // action 可能是open/update/close/reopen
  };
}

interface TagPushEvent {
  object_kind: 'tag_push';
  before: string;
  after: string;
  ref: string;
  checkout_sha: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  project_id: number;
  project: Project;
  repository: Repository;
  commits: Commit[];
  total_commits_count: number;
}

interface BuildEvent {
  object_kind: 'build';
  ref: string;
  tag: boolean;
  before_sha: string;
  sha: string;
  build_id: number;
  build_name: string;
  build_stage: string;
  build_status: string;
  build_created_at: string | null;
  build_started_at: string | null;
  build_finished_at: string | null;
  build_duration: string | null;
  build_allow_failure: boolean;
  build_failure_reason: string;
  pipeline_id: number;
  project_id: number;
  project_name: string;
  user: User;
  commit: Commit;
  repository: Repository;
  runner: Runner;
  environment: Environment | null;
}

interface Environment {
  name: string;
  action: string;
  deployment_tier: string;
}

interface ArtifactsFile {
  filename: string;
  size: number;
}

interface PipelineEvent {
  object_kind: 'pipeline';
  object_attributes: {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    status: string;
    stages: string[];
    created_at: string;
    finished_at: string;
    duration: number;
  };
  merge_request: {
    id: number;
    iid: number;
    title: string;
    source_branch: string;
    source_project_id: number;
    target_branch: string;
    target_project_id: number;
    state: string;
    merge_status: string;
    url: string;
  };
  user: User;
  project: Project;
  commit: Commit;
  builds: {
    id: number;
    stage: string;
    name: string;
    status: string;
    created_at: string;
    started_at: null;
    finished_at: null;
    when: string;
    manual: boolean;
    allow_failure: boolean;
    user: User;
    runner: null;
    artifacts_file: ArtifactsFile;
    environment: Environment;
  }[];
}

export type GitLabWebhooksEvent =
  | IssueEvent
  | MergeRequestEvent
  | PushEvent
  | TagPushEvent
  | BuildEvent
  | PipelineEvent;

/**
 * user defined type guard for GitLabWebhooksEvent
 * @param event 待判断的对象
 * @returns 是否是 GitLabWebhooksEvent
 */
export function isGitLabWebhooksEvent(event: { object_kind?: string }): event is GitLabWebhooksEvent {
  if (event.object_kind !== undefined) {
    return true;
  }
  return false;
}
