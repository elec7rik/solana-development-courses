const DISCRIMINATOR: usize = 8;
const MAX_NAME_LENGTH: usize = 20;
const MAX_MESSAGE_LENGTH: usize = 50;

#[error_code]
enum StudentAccountError {
    #[msg("Student name is too long")]
    InvalidName,
    #[msg("Student message is too long")]
    InvalidMessage,
}

use anchor_lang::prelude::*;

declare_id!("6gcHWEE9qvFT9qNBfc7Puxhf8UqGLuc4REtLBTQhvBQD");

#[program]
pub mod anchor_student_intro_program {

    use super::*;

    pub fn create_intro(ctx: Context<CreateIntro>, name: String, message: String) -> Result<()> {
        require!(name.len() <= MAX_NAME_LENGTH, StudentAccountError::InvalidName);
        require!(message.len() <= MAX_MESSAGE_LENGTH, StudentAccountError::InvalidMessage);
        let student_account = &mut ctx.accounts.student_account;
        student_account.name = name;
        student_account.message = message;
        student_account.student = ctx.accounts.student.key();
        Ok(())
    }

    pub fn update_intro(ctx: Context<UpdateIntro>, name: String, message: String) -> Result<()> {
        // require!(name.len() <= MAX_NAME_LENGTH, StudentAccountError::InvalidName);
        require!(message.len() <= MAX_MESSAGE_LENGTH, StudentAccountError::InvalidMessage);
        let student_account = &mut ctx.accounts.student_account;
        student_account.message = message;
        Ok(())
    }

    pub fn delete_intro(ctx: Context<DeleteIntro>, name: String) -> Result<()> {
        msg!("Deleting Intro account");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateIntro<'info> {
    #[account(
        init,
        space = DISCRIMINATOR + StudentAccount::INIT_SPACE,
        payer = student,
        seeds = [student.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub student_account: Account<'info, StudentAccount>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct UpdateIntro<'info> {
    #[account(
        mut,
        seeds = [student.key().as_ref(), name.as_bytes()],
        bump,
        realloc = DISCRIMINATOR + StudentAccount::INIT_SPACE,
        realloc::payer = student,
        realloc::zero = true,
    )]
    pub student_account: Account<'info, StudentAccount>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DeleteIntro<'info> {
    #[account(
        mut,
        seeds = [student.key().as_ref(), name.as_bytes()],
        bump,
        close = student
    )]
    pub student_account: Account<'info, StudentAccount>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,

}

#[account]
#[derive(InitSpace)]
pub struct  StudentAccount {
    #[max_len(MAX_NAME_LENGTH)]
    pub name : String,
    #[max_len(MAX_MESSAGE_LENGTH)]
    pub message : String,
    pub student: Pubkey,
}