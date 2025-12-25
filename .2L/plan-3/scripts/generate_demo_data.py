#!/usr/bin/env python3
"""
StatViz Demo Data Generator
============================
Generates fake research dataset for the demo page.

Research Topic: הקשר בין שימוש ברשתות חברתיות לבין דימוי גוף ודיכאון בקרב מתבגרים
Sample: N=180 adolescents (ages 14-18)

Variables:
- Social media use (10 items, 1-5 scale)
- Body image (12 items, 1-6 scale)
- Depression (8 items, 1-4 scale)
- Demographics: gender, age, school_type

Hypotheses (baked-in significant results):
1. H1: Social media → negative body image (r ≈ -0.35 to -0.45)
2. H2: Social media → higher depression (r ≈ 0.30 to 0.40)
3. H3: Girls report worse body image than boys (d ≈ 0.4-0.6)
4. H4: Body image mediates social media → depression (Sobel p < .05)
5. H5: Sector differences in social media use (η² ≈ 0.06-0.10)

Usage:
    python generate_demo_data.py

Output:
    demo_dataset.xlsx
"""

import numpy as np
import pandas as pd
from scipy import stats

# Set seed for reproducibility
np.random.seed(42)

# Sample size
N = 180

def generate_correlated_data():
    """
    Generate correlated variables using Cholesky decomposition.

    Target correlations:
    - social_media ↔ body_image: r = -0.40 (negative)
    - social_media ↔ depression: r = 0.35 (positive)
    - body_image ↔ depression: r = -0.45 (negative - worse body image = more depression)
    """

    # Correlation matrix (note: body_image is reverse-coded, higher = better)
    # So negative correlation with social_media means more SM = worse body image
    corr_matrix = np.array([
        [1.00, -0.40, 0.35],   # social_media
        [-0.40, 1.00, -0.45],  # body_image
        [0.35, -0.45, 1.00]    # depression
    ])

    # Cholesky decomposition
    L = np.linalg.cholesky(corr_matrix)

    # Generate uncorrelated standard normal data
    uncorrelated = np.random.randn(N, 3)

    # Apply Cholesky to create correlations
    correlated = uncorrelated @ L.T

    return correlated

def scale_to_range(data, min_val, max_val, num_items):
    """Scale standardized data to Likert scale range."""
    # Convert z-scores to 0-1 range using CDF
    scaled = stats.norm.cdf(data)
    # Scale to desired range
    scaled = scaled * (max_val - min_val) + min_val
    return scaled

def add_gender_effect(body_image, gender, effect_size=0.5):
    """
    Add gender effect: girls (בת) report worse body image.
    effect_size: Cohen's d
    """
    girls_mask = gender == 'בת'
    # Lower body image for girls
    body_image[girls_mask] -= effect_size * np.std(body_image)
    return body_image

def add_sector_effect(social_media, sector, eta_squared=0.08):
    """
    Add sector differences in social media use.
    חרדי < ממ"ד < ממלכתי
    """
    # Create effect based on sector
    sector_effects = {
        'ממלכתי': 0.4,    # Higher use
        'ממ"ד': 0.0,      # Medium
        'חרדי': -0.5      # Lower use
    }

    effect = np.array([sector_effects.get(s, 0) for s in sector])
    social_media += effect * np.std(social_media)
    return social_media

def generate_item_scores(mean_score, num_items, scale_max, n=N):
    """Generate individual item scores with realistic variance."""
    items = []
    for i in range(num_items):
        # Add some random shift per item
        item_mean = mean_score + np.random.normal(0, 0.3)
        # Generate scores with noise
        item_scores = item_mean + np.random.normal(0, 0.8, n)
        # Clip to valid range
        item_scores = np.clip(item_scores, 1, scale_max)
        item_scores = np.round(item_scores)
        items.append(item_scores)
    return np.array(items).T

def main():
    print("Generating StatViz demo dataset...")
    print(f"Sample size: N = {N}")
    print()

    # Generate demographics
    gender = np.random.choice(['בן', 'בת'], size=N, p=[0.45, 0.55])  # Slightly more girls
    age = np.random.choice(range(14, 19), size=N)
    sector = np.random.choice(['ממלכתי', 'ממ"ד', 'חרדי'], size=N, p=[0.5, 0.3, 0.2])

    # Generate correlated latent variables
    latent = generate_correlated_data()

    # Extract and scale
    social_media_latent = latent[:, 0]
    body_image_latent = latent[:, 1]
    depression_latent = latent[:, 2]

    # Apply demographic effects
    body_image_latent = add_gender_effect(body_image_latent, gender)
    social_media_latent = add_sector_effect(social_media_latent, sector)

    # Scale to Likert ranges (mean scores)
    social_media_mean = scale_to_range(social_media_latent, 1.5, 4.5, 10)
    body_image_mean = scale_to_range(body_image_latent, 2.0, 5.0, 12)
    depression_mean = scale_to_range(depression_latent, 1.2, 3.2, 8)

    # Generate individual items
    social_media_items = generate_item_scores(social_media_mean, 10, 5)
    body_image_items = generate_item_scores(body_image_mean, 12, 6)
    depression_items = generate_item_scores(depression_mean, 8, 4)

    # Create DataFrame
    data = {
        'מספר_נבדק': range(1, N + 1),
        'מגדר': gender,
        'גיל': age,
        'סוג_בית_ספר': sector,
    }

    # Add social media items
    for i in range(10):
        data[f'רשתות_{i+1}'] = social_media_items[:, i].astype(int)

    # Add body image items
    for i in range(12):
        data[f'דימוי_גוף_{i+1}'] = body_image_items[:, i].astype(int)

    # Add depression items
    for i in range(8):
        data[f'דיכאון_{i+1}'] = depression_items[:, i].astype(int)

    df = pd.DataFrame(data)

    # Calculate scale means for verification
    social_cols = [f'רשתות_{i+1}' for i in range(10)]
    body_cols = [f'דימוי_גוף_{i+1}' for i in range(12)]
    depression_cols = [f'דיכאון_{i+1}' for i in range(8)]

    df['ממוצע_רשתות'] = df[social_cols].mean(axis=1).round(2)
    df['ממוצע_דימוי_גוף'] = df[body_cols].mean(axis=1).round(2)
    df['ממוצע_דיכאון'] = df[depression_cols].mean(axis=1).round(2)

    # Verify correlations
    print("Verifying baked-in correlations:")
    print(f"  Social Media ↔ Body Image: r = {df['ממוצע_רשתות'].corr(df['ממוצע_דימוי_גוף']):.3f}")
    print(f"  Social Media ↔ Depression: r = {df['ממוצע_רשתות'].corr(df['ממוצע_דיכאון']):.3f}")
    print(f"  Body Image ↔ Depression:   r = {df['ממוצע_דימוי_גוף'].corr(df['ממוצע_דיכאון']):.3f}")
    print()

    # Verify gender effect
    boys = df[df['מגדר'] == 'בן']['ממוצע_דימוי_גוף']
    girls = df[df['מגדר'] == 'בת']['ממוצע_דימוי_גוף']
    t_stat, p_val = stats.ttest_ind(boys, girls)
    cohens_d = (boys.mean() - girls.mean()) / np.sqrt((boys.var() + girls.var()) / 2)
    print(f"Gender effect on body image:")
    print(f"  Boys mean: {boys.mean():.2f}, Girls mean: {girls.mean():.2f}")
    print(f"  t = {t_stat:.2f}, p = {p_val:.4f}, d = {cohens_d:.2f}")
    print()

    # Verify sector effect
    groups = [df[df['סוג_בית_ספר'] == s]['ממוצע_רשתות'] for s in ['ממלכתי', 'ממ"ד', 'חרדי']]
    f_stat, p_val = stats.f_oneway(*groups)
    ss_between = sum(len(g) * (g.mean() - df['ממוצע_רשתות'].mean())**2 for g in groups)
    ss_total = sum((df['ממוצע_רשתות'] - df['ממוצע_רשתות'].mean())**2)
    eta_squared = ss_between / ss_total
    print(f"Sector effect on social media use:")
    print(f"  ממלכתי: {groups[0].mean():.2f}, ממ\"ד: {groups[1].mean():.2f}, חרדי: {groups[2].mean():.2f}")
    print(f"  F = {f_stat:.2f}, p = {p_val:.4f}, η² = {eta_squared:.3f}")
    print()

    # Save to Excel
    output_file = 'demo_dataset.xlsx'
    df.to_excel(output_file, index=False)
    print(f"Dataset saved to: {output_file}")
    print(f"Total rows: {len(df)}")
    print(f"Total columns: {len(df.columns)}")

    return df

if __name__ == '__main__':
    df = main()
