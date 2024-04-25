export class CreateInstallmentDto{
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
export class UpdateInstallmentDto {
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