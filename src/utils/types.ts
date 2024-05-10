export type CreateInstallmentParams = {
    installment_number: number;
    loan_type: string;
    loan_date: Date;
    due_date: Date;
    debt_amount: number;
    debt_outstanding: number;
    debt_installments: number;
    payment_per_installment: number;
    installments_outstanding: number;
    comments: string;
}

export type UpdateInstallmentParams = {
    installment_number: number;
    loan_type: string;
    loan_date: Date;
    due_date: Date;
    debt_amount: number;
    debt_outstanding: number;
    debt_installments: number;
    payment_per_installment: number;
    installments_outstanding: number;
    comments: string;
  }

export type CreatePhoneTrackerParams = {
    username_tracker: string;
    time_update: Date;
    response: string;
    comments: string;
}
export type UpdatePhoneTrackerParams = {
    username_tracker: string;
    response: string;
    comments: string;
}

export type CreateDocumentTrackerParams = {
    file_document_tracker: string;
    time_update: Date;
    response: string;
    comments: string;
}
export type UpdatDocumentTrackerParams = {
    file_document_tracker: string;
    time_update: Date;
    response: string;
    comments: string;
}

export type CreateOutsourceTrackerParams = {
    username_tracker: string;
    time_update: Date;
    response: string;
    comments: string;

  }
  export type UpdateOutsourceTrackerParams = {
    username_tracker: string;
    time_update: Date;
    response: string;
    comments: string;
  }

  export type CreateCancelContractParams ={
    type_item: string;
    response: string;
    comments: string;
}
export type UpdateCancelContractParams ={
    type_item: string;
    response: string;
    comments: string;
}
export type CreateAfterValueParams ={
    name_value: string;
    price_value: number;
}
export type UpdateAfterValueParams ={
    name_value: string;
    price_value: number;
}
export type CreateBeforeValueParams ={
    name_value: string;
    price_value: number;
}
export type UpdateBeforeValueParams = {
    name_value: string;
    price_value: number;
}