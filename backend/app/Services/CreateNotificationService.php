<?php

namespace App\Services;

use App\Events\ClickConversionRecieved;
use App\Events\NotificationSent;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class CreateNotificationService
{

    public function create($message, $userIds, $roles)
    {
        $user = Auth::user();
        $payload = [
            'type' => 'info',
            'username' => $user->username,
            'message' => $message,
            'user_ids' => $userIds,
            'roles' => $roles

        ];
        $userIds = explode(',', $userIds);
        $roles = explode(',', $roles);
        $create = Notification::create($payload);
        if ($create) {
            event(new NotificationSent([
                'message' => $message,
                'user_id' => $userIds,
            ], $userIds, $roles));
        }
    }
    public function clickConversoin($userIds, $roles)
    {
        $userIds = explode(',', $userIds);
        $roles = explode(',', $roles);
        event(new ClickConversionRecieved([
            'message' => '',
            'user_id' => $userIds,
        ], $userIds, $roles));
    }
}