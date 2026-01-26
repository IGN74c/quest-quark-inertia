import { useState } from 'react';

export function useBoardModals() {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isColumnOpen, setIsColumnOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<number | null>(null);

    const openTaskDialog = (columnId: number) => {
        setCurrentColumnId(columnId);
        setIsTaskOpen(true);
    };

    return {
        rename: { open: isRenameOpen, setOpen: setIsRenameOpen },
        delete: { open: isDeleteOpen, setOpen: setIsDeleteOpen },
        users: { open: isUsersOpen, setOpen: setIsUsersOpen },
        column: { open: isColumnOpen, setOpen: setIsColumnOpen },
        task: { open: isTaskOpen, setOpen: setIsTaskOpen },

        currentColumnId,
        openTaskDialog,
    };
}
