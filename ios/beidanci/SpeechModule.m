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
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([self.synthesizer isSpeaking]) {
      [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
    }
    AVSpeechUtterance *utterance = [[AVSpeechUtterance alloc] initWithString:text];
    utterance.voice = [AVSpeechSynthesisVoice voiceWithLanguage:lang];
    utterance.rate = rate;
    utterance.pitchMultiplier = 1.0;
    [self.synthesizer speakUtterance:utterance];
  });
}

@end
