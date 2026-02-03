import { create } from 'zustand';

type DialogType = 'alert' | 'confirm' | 'danger' | 'success';

interface DialogConfig {
	type: DialogType;
	content: string;
	confirmText?: string;
	cancelText?: string;
}

interface DialogState {
	isOpen: boolean;
	config: DialogConfig | null;
	resolve: (value: boolean) => void;
	open: (config: DialogConfig) => Promise<boolean>; // 내부 사용
	alert: (content: string) => Promise<boolean>;
	confirm: (content: string, options?: Partial<DialogConfig>) => Promise<boolean>;
	danger: (content: string, options?: Partial<DialogConfig>) => Promise<boolean>;
	success: (content: string, options?: Partial<DialogConfig>) => Promise<boolean>;
	closeDialog: (result: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
	isOpen: false,
	config: null,
	resolve: () => {},
	open: (config) => {
		set({ isOpen: true, config });
		return new Promise<boolean>((resolve) => {
			set({ resolve });
		});
	},

	alert: (content) => get().open({ type: 'alert', content, confirmText: '확인' }),
	success: (content, options) => get().open({ type: 'success', content, ...options }),
	danger: (content, options) => get().open({ type: 'danger', content, ...options }),
	confirm: (content, options) => get().open({ type: 'confirm', content, ...options }),
	closeDialog: (result) => {
		get().resolve(result);
		set({ isOpen: false, config: null });
	},
}));
