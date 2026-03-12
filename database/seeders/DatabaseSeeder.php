<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => 'demo@economizze.local'],
            [
                'global_uuid' => (string) Str::uuid(),
                'name' => 'Demo Economizze',
                'password' => Str::password(32),
                'email_verified_at' => now(),
            ],
        );

        $this->call([
            AccountSeeder::class,
            CategorySeeder::class,
            TransactionSeeder::class,
        ]);
    }
}
