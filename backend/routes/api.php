<?php

use App\Http\Controllers\API\Authentication\LoginController;
use App\Http\Controllers\API\Authentication\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Authenticated\DomainController;
use App\Http\Controllers\Authenticated\FetchController;
use App\Http\Controllers\Authenticated\NetworkController;
use App\Http\Controllers\Authenticated\TrackersController;
use App\Http\Controllers\Authenticated\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/checkCredentials', [LoginController::class, 'checkCredentials']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::post('/auth/register', [RegisterController::class, 'store']);
Route::post('/auth/forgot', [LoginController::class, 'login']);
Route::post('/auth/forgot', [LoginController::class, 'login']);
Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify']);
Route::post('email/resend', [VerificationController::class, 'resendVerificationEmail']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/get/userDetails', [UserController::class, 'getUserDetails']);
    Route::apiResource('/domain', DomainController::class);
    Route::apiResource('/trackers', TrackersController::class);
    Route::apiResource('/networks', NetworkController::class);
    Route::apiResource('/users', UserController::class);
    // Fetch requests
    Route::get('/fetch/all-users', [FetchController::class, 'fetchFilterAllUsers']);
    Route::get('/fetch/trackers', [FetchController::class, 'fetchFilterTrackers']);
    Route::get('/fetch/networks', [FetchController::class, 'fetchFilterNetworks']);
    Route::get('/fetch/offers', [FetchController::class, 'fetchFilterOffers']);
    Route::get('/fetch/domains', [FetchController::class, 'fetchFilterDomains']);
});