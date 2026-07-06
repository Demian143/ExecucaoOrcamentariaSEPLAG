<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(OrcamentoSeeder::class);

        User::updateOrCreate(
            ['email' => 'analista@seplag.rj.gov.br'],
            [
                'name' => 'Analista Seplag',
                'password' => Hash::make('orcamento@2026'),
            ],
        );
    }
}
