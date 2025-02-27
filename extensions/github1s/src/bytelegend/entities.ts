import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { CommitTreeDataProvider } from '@/views/commit-list-view';

const commitTreeDataProvider = new CommitTreeDataProvider();

export class AnswerCommit {
	constructor(
		readonly title: string,
		readonly sha: string,
		readonly checkRunId: string,
		readonly time: string,
		readonly conclusion?: string,
		readonly parentSha?: string
	) {}

	get stale(): boolean {
		const tenMinutesAgo = new Date(
			new Date().getTime() - 10 * 60 * 1000
		).toISOString();
		return this.time < tenMinutesAgo;
	}

	async getChildren(): Promise<TreeItem[]> {
		const changedFiles = await commitTreeDataProvider.getCommitFileItems({
			author: { avatar_url: '', login: '' },
			commit: { author: { date: '', email: '', name: '' }, message: '' },
			sha: this.sha,
			parents: [
				{
					sha: this.parentSha,
				},
			],
		});
		return changedFiles;
	}

	get id() {
		return this.sha;
	}

	iconPath() {
		if (!this.conclusion) {
			return this.stale ? warningIcon : loadingIcon;
		} else if (this.conclusion === CheckRunConclusion.SUCCESS) {
			return greenTickIcon;
		} else {
			return redCrossIcon;
		}
	}

	get treeItem(): TreeItem {
		return {
			label: this.title,
			id: this.id,
			iconPath: this.iconPath(),
			collapsibleState: TreeItemCollapsibleState.Collapsed,
			contextValue: 'MyAnswer',
			command: {
				title: 'showAnswerLog',
				command: 'bytelegend.showAnswerLog',
				arguments: [this.id],
			},
		};
	}
}

// https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/pass.svg
const greenTickIcon = Uri.parse(
	"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.27 10.87h.71l4.56-4.56-.71-.71-4.2 4.21-1.92-1.92L4 8.6l2.27 2.27z' fill='%2389D185'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z' fill='%2389D185'/%3E%3C/svg%3E"
);
// https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/error.svg
const redCrossIcon = Uri.parse(
	"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z' fill='%23F48771'/%3E%3C/svg%3E"
);
// https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/warning.svg
const warningIcon = Uri.parse(
	"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.7L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z' fill='%23FC0'/%3E%3C/svg%3E"
);
const loadingIcon = Uri.parse(
	'data:image/gif;base64,R0lGODlhIAAgAPMAAMrKyoiIiLGxsevr67+/v9TU1H9/fz8/P2pqalVVVSoqKpSUlKmpqRUVFf///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUU4MEFBRTQxQkFCMTFFNjkyRTJENEE2MjgwNzUzNUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUU4MEFBRTUxQkFCMTFFNjkyRTJENEE2MjgwNzUzNUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBRTgwQUFFMjFCQUIxMUU2OTJFMkQ0QTYyODA3NTM1RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBRTgwQUFFMzFCQUIxMUU2OTJFMkQ0QTYyODA3NTM1RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t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'
);

export class PullRequestAnswer {
	constructor(
		readonly title: string,
		readonly baseRepoFullName: string,
		readonly headRepoFullName: string,
		readonly number: string,
		readonly branch: string,
		readonly time: string,
		readonly open: boolean,
		readonly accomplished: boolean,
		readonly commits: AnswerCommit[]
	) {}

	iconPath() {
		return this.commits.length === 0 ? null : this.commits[0].iconPath();
	}

	get treeItem(): TreeItem {
		// don't show link icon for dummy check run
		const contextValue = this.id.startsWith('DUMMY-CHECK-RUN')
			? ''
			: 'MyAnswer';
		return {
			label: this.title,
			id: this.id,
			iconPath: this.iconPath(),
			collapsibleState: TreeItemCollapsibleState.Collapsed,
			command: {
				title: 'showAnswerLog',
				command: 'bytelegend.openPrDescriptionAndShowAnswerLog',
				arguments: [this.id],
			},
			contextValue,
		};
	}

	get htmlUrl() {
		return `https://github.com/${this.baseRepoFullName}/pull/${this.number}`;
	}

	get id() {
		return this.htmlUrl;
	}
}

export const CheckRunConclusion = {
	ACTION_REQUIRED: 'ACTION_REQUIRED',
	CANCELLED: 'CANCELLED',
	FAILURE: 'FAILURE',
	NEUTRAL: 'NEUTRAL',
	SUCCESS: 'SUCCESS',
	SKIPPED: 'SKIPPED',
	STALE: 'STALE',
	TIMED_OUT: 'TIMED_OUT',
};

export class Tutorial {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly type: string,
		readonly href: string,
		readonly languages: Array<string>
	) {}
}
