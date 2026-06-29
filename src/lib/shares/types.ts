export type ShareDTO = {
  id: string;
  documentId: string;
  userId: string;
  createdAt: string;
};

export type ShareWithUserDTO = ShareDTO & {
  userName: string;
  userEmail: string;
};
