use anchor_lang::prelude::*;

declare_id!("DJ3PrFiNtqCTj4FeGjXY6gaNxDbCnC5pUg7LSWJ4HxbF");

#[program]
pub mod anchor_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter initialized with current count: {}", counter.count);
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Counter before increment: {}", counter.count);
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter after increment: {}", counter.count);
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Counter before increment: {}", counter.count);
        counter.count = counter.count.checked_sub(1).unwrap();
        msg!("Counter after increment: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = DISCRIMINATOR + Counter::INIT_SPACE)]
    counter : Account<'info, Counter>,
    #[account(mut)]
    user : Signer<'info>,
    system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    counter: Account<'info, Counter>,
    #[account(mut)]
    user: Signer<'info>,
}

const DISCRIMINATOR: usize = 8;

#[account]
#[derive(InitSpace)]
pub struct Counter {
    count : u64
}