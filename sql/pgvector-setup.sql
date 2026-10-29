-- =====================================================
-- Elzada AI Admission Website – pgvector setup
-- =====================================================
-- Enables the pgvector extension used by the RAG pipeline.
-- Run this BEFORE schema.sql. On Supabase this can be done via the
-- SQL editor in the dashboard.

create extension if not exists vector;

-- Verify
select extname, extversion from pg_extension where extname = 'vector';
