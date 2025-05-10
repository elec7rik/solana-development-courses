const MIN_RATING: u8 = 1;
const MAX_RATING: u8 = 5;
const MAX_TITLE_LENGTH: usize = 20;
const MAX_DESCRIPTION_LENGTH: usize = 50;
const DISCRIMINATOR: usize = 8;

use anchor_lang::prelude::*;

declare_id!("6dHK2Fx46phX1ciTGg4Hyr1i1NY9RRY3zEGhzMzMj5n5");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn add_movie_review(
        ctx: Context<AddMovieReview>,
        rating: u8,
        title: String,
        description: String,
    ) -> Result<()> {
        // Rating check
        require!(rating >= MIN_RATING && rating <= MAX_RATING, MovieReviewError::InvalidRating);
        // Title length check
        require!(title.len() <= MAX_TITLE_LENGTH, MovieReviewError::TitleTooLong);
        // Description length check
        require!(description.len() <= MAX_DESCRIPTION_LENGTH, MovieReviewError::DescriptionTooLong);

        msg!("New Movie Review added");
        msg!("Title: {}", title);
        msg!("Description: {}", description);
        msg!("Rating: {}", rating);

        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.rating = rating;
        movie_review.title = title;
        movie_review.description = description;
        movie_review.reviewer = ctx.accounts.reviewer.key();

        Ok(())
    }

    pub fn update_movie_review(
        ctx: Context<UpdateMovieReview>,
        rating: u8,
        title: String,
        description: String
    ) -> Result<()> {
        // Rating check
        require!(rating >= MIN_RATING && rating <= MAX_RATING, MovieReviewError::InvalidRating);
        // Title length check
        require!(title.len() <= MAX_TITLE_LENGTH, MovieReviewError::TitleTooLong);
        // Description length check
        require!(description.len() <= MAX_DESCRIPTION_LENGTH, MovieReviewError::DescriptionTooLong);

        msg!("Movie account space reallocated");
        msg!("Description: {}", description);
        msg!("Rating: {}", rating);
        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.rating = rating;
        movie_review.title = title;
        movie_review.description = description;

        Ok(())   
    }

    // Close
    pub fn delete_movie_review(_ctx: Context<DeleteMovieReview>, title: String) -> Result<()> {
        // msg!("{} Movie Review Account closed", title);
        Ok(())
    }
    
}

#[derive(Accounts)]
#[instruction(rating:u8, title:String)]     /* will fail to deserialize if only title is passed*/
pub struct AddMovieReview<'info> {
    #[account(
        init,
        payer = reviewer,
        space = DISCRIMINATOR + MovieAccountState::INIT_SPACE,
        seeds = [title.as_bytes(), reviewer.key().as_ref()],
        bump
    )]
    pub movie_review : Account<'info, MovieAccountState>,

    #[account(mut)]
    pub reviewer : Signer<'info>,

    pub system_program : Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(rating:u8, title:String)]
pub struct UpdateMovieReview<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), reviewer.key().as_ref()],
        bump,
        realloc = DISCRIMINATOR + MovieAccountState::INIT_SPACE,
        realloc::payer = reviewer,
        realloc::zero = true,
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub reviewer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteMovieReview<'info> {
    #[account(
        mut,
        seeds=[title.as_bytes(), reviewer.key().as_ref()],
        bump,
        close=reviewer
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub reviewer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct MovieAccountState {
    pub reviewer : Pubkey,      // 32 bytes
    pub rating : u8,           // 1 byte
    #[max_len(20)]
    pub title : String,         // 4 + len()
    #[max_len(50)]
    pub description :  String,  // 4 + len()
}

#[error_code]
enum MovieReviewError {
    #[msg("Movie Rating should be between 1 to 5")]
    InvalidRating,
    #[msg("Movie Title too long")]
    TitleTooLong,
    #[msg("Movie Description too long")]
    DescriptionTooLong,
}
