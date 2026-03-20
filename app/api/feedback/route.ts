import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guide_id, user_name, user_email, rating, comment } = body;

    // Validate input
    if (!guide_id || !user_name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert feedback into database
    const { data, error } = await supabaseAdmin
      .from('user_feedback')
      .insert([
        {
          guide_id,
          user_name,
          user_email: user_email || null,
          rating,
          comment,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    // Send Discord notification (optional)
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: '📝 New Guide Feedback',
                fields: [
                  { name: 'Guide ID', value: guide_id, inline: true },
                  { name: 'Rating', value: `⭐ ${rating}/5`, inline: true },
                  { name: 'User', value: user_name, inline: true },
                  { name: 'Comment', value: comment },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (err) {
        console.error('Discord notification failed:', err);
        // Don't fail the request if Discord notification fails
      }
    }

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const guide_id = req.nextUrl.searchParams.get('guide_id');

    if (!guide_id) {
      return NextResponse.json(
        { error: 'guide_id parameter required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('user_feedback')
      .select()
      .eq('guide_id', guide_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
