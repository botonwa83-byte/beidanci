#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridgeModule.h>

@interface SpeechModule : NSObject <RCTBridgeModule>
@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@end

@implementation SpeechModule

RCT_EXPORT_MODULE(Speech);

- (instancetype)init {
  self = [super init];
  if (self) {
    _synthesizer = [[AVSpeechSynthesizer alloc] init];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_EXPORT_METHOD(speak:(NSString *)text lang:(NSString *)lang rate:(float)rate) {
  if (text.length == 0) {
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    // 配置音频会话为 playback，这样即使手机处于静音模式也能发音
    NSError *audioError = nil;
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayback
                    mode:AVAudioSessionModeSpokenAudio
                 options:AVAudioSessionCategoryOptionDuckOthers
                   error:&audioError];
    [session setActive:YES withOptions:0 error:&audioError];

    if ([self.synthesizer isSpeaking]) {
      [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
    }
    AVSpeechUtterance *utterance = [[AVSpeechUtterance alloc] initWithString:text];
    AVSpeechSynthesisVoice *voice =
        [AVSpeechSynthesisVoice voiceWithLanguage:lang];
    if (voice == nil) {
      // 找不到指定语言的语音时，兜底用美式英语
      voice = [AVSpeechSynthesisVoice voiceWithLanguage:@"en-US"];
    }
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitchMultiplier = 1.0;
    [self.synthesizer speakUtterance:utterance];
  });
}

@end
