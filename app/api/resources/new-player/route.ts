import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('new_player_cards')
    .select()
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, order } = body;
  if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('new_player_cards')
    .insert([{ title, content, sort_order: order ?? 0 }])
    .select();

  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  return NextResponse.json({ data: data[0] }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, content, order } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('new_player_cards')
    .update({ title, content, sort_order: order })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabaseAdmin.from('new_player_cards').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  return NextResponse.json({ success: true });
}
