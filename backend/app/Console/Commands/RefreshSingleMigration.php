<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RefreshSingleMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:refresh-single {migration}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh a single migration file';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $migration = $this->argument('migration');

        // Rollback the specific migration
        Artisan::call('migrate:rollback', [
            '--path' => '/database/migrations/' . $migration . '.php',
        ]);

        // Re-run the specific migration
        Artisan::call('migrate', [
            '--path' => '/database/migrations/' . $migration . '.php',
        ]);

        $this->info('Migration refreshed: ' . $migration);
    }
}
